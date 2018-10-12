'use strict';

/**
 * Requirements
 * @ignore
 */
const Route = require('./Route.js').Route;
const CliLogger = require('../../cli/CliLogger.js').CliLogger;
const SystemModuleConfiguration = require('../../configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const UrlsConfiguration = require('../../model/configuration/UrlsConfiguration.js')
    .UrlsConfiguration;
const PathesConfiguration = require('../../model/configuration/PathesConfiguration.js')
    .PathesConfiguration;
const TemplateRenderer = require('../../nunjucks/TemplateRenderer.js').TemplateRenderer;
const assertParameter = require('../../utils/assert.js').assertParameter;
const co = require('co');
const fs = require('fs');
const path = require('path');
const pathes = require('../../utils/pathes.js');

/**
 * A route to serve nunjucks based templates
 *
 * @memberOf server.routes
 */
class TemplateRoute extends Route {
    /**
     * @param {cli.CliLogger} cliLogger
     * @param {model.configuration.UrlsConfiguration} urlsConfiguration
     * @param {model.configuration.PathesConfiguration} pathesConfiguration
     * @param {configuration.SystemModuleConfiguration} moduleConfiguration
     * @param {nunjucks.TemplateRenderer} templateRenderer
     * @param {Array} templatePaths
     */
    constructor(
        cliLogger,
        urlsConfiguration,
        pathesConfiguration,
        moduleConfiguration,
        templateRenderer,
        templatePaths,
        templateHandlers
    ) {
        super(cliLogger.createPrefixed('routes.template'));

        // Check params
        assertParameter(this, 'urlsConfiguration', urlsConfiguration, true, UrlsConfiguration);
        assertParameter(
            this,
            'pathesConfiguration',
            pathesConfiguration,
            true,
            PathesConfiguration
        );
        assertParameter(
            this,
            'moduleConfiguration',
            moduleConfiguration,
            true,
            SystemModuleConfiguration
        );
        assertParameter(this, 'templateRenderer', templateRenderer, true, TemplateRenderer);

        // Assign options
        this._pathesConfiguration = pathesConfiguration;
        this._urlsConfiguration = urlsConfiguration;
        this._moduleConfiguration = moduleConfiguration;
        this._templateRenderer = templateRenderer;
        this._templateHandlers = [];

        // Add template pathes
        if (templatePaths) {
            this.addTemplatePath(templatePaths);
        }

        // Add template handlers
        if (Array.isArray(templateHandlers)) {
            for (const templateHandler of templateHandlers) {
                this.addTemplateHandler(
                    templateHandler.route,
                    templateHandler.template,
                    templateHandler.authenticate
                );
            }
        }
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [
                CliLogger,
                UrlsConfiguration,
                PathesConfiguration,
                SystemModuleConfiguration,
                TemplateRenderer,
                'server.route/TemplateRoute.templatePaths',
                'server.route/TemplateRoute.templateHandlers'
            ]
        };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'server.route/TemplateRoute';
    }

    /**
     * @type {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration() {
        return this._pathesConfiguration;
    }

    /**
     * @type {model.configuration.UrlsConfiguration}
     */
    get urlsConfiguration() {
        return this._urlsConfiguration;
    }

    /**
     * @type {Array}
     */
    get templatePaths() {
        return this.templateRenderer.templatePaths;
    }

    /**
     * @type {nunjucks.TemplateRenderer}
     */
    get templateRenderer() {
        return this._templateRenderer;
    }

    /**
     * @type {configuration.SystemModuleConfiguration}
     */
    get moduleConfiguration() {
        return this._moduleConfiguration;
    }

    /**
     * @inheritDoc
     */
    afterRegistration() {
        if (this.server) {
            for (const handler of this._templateHandlers) {
                this.cliLogger.info(handler.message);
                this.server.express.all(handler.route, handler.handler);
            }
        }
    }

    /**
     * Adds the given pathes to templatePaths
     */
    addTemplatePath(...templatePaths) {
        this.templateRenderer.addTemplatePath(...templatePaths);
    }

    /**
     * @inheritDoc
     */
    addTemplateHandler(route, template, authenticate) {
        const resolvedRoute = this.moduleConfiguration.resolveConfiguration(route);
        const scope = this;
        const handler = (request, response, next) => {
            co(function*() {
                scope.logger.debug('Trying route ' + resolvedRoute + ' for template ' + template);

                // Collect VO's
                const valueObjects = {};

                // Create a short url for simple model matches
                const url = request.url
                    .split('/')
                    .slice(0, 4)
                    .join('/');

                // Get site
                const site = yield scope.urlsConfiguration.matchSite(url, true);
                if (site) {
                    valueObjects.site = site.site;
                }

                // Get entityCategory
                const entityCategory = yield scope.urlsConfiguration.matchEntityCategory(url, true);
                if (entityCategory) {
                    valueObjects.entityCategory = entityCategory.entityCategory;
                }

                // Get entity
                const entity = yield scope.urlsConfiguration.matchEntityId(url);
                if (entity) {
                    valueObjects.entity = entity.entity;
                }

                // Check if needed valueObjects are present
                if (request.params.site && !valueObjects.site) {
                    scope.logger.debug('Skipping route ' + resolvedRoute + ': no valid site site');
                    next();
                    return;
                }
                if (request.params.entityCategory && !valueObjects.entityCategory) {
                    scope.logger.debug(
                        'Skipping route ' + resolvedRoute + ': missing entityCategory'
                    );
                    next();
                    return;
                }
                if (request.params.entityId && !valueObjects.entity) {
                    scope.logger.debug('Skipping route ' + resolvedRoute + ': missing entity');
                    next();
                    return;
                }

                // Find template file
                let templateContents = false;
                let filename = '';

                // Try to find it in template pathes
                if (template) {
                    for (const templatePath of scope.templatePaths) {
                        if (!templateContents) {
                            filename = path.join(templatePath, '/' + template);
                            scope.logger.debug(
                                'Trying template ' + filename + ' for route ' + resolvedRoute
                            );
                        }
                    }
                } else {
                    // Check for a direct hit
                    const match = yield scope.urlsConfiguration.matchEntityFile(request.path);
                    if (!match || !match.file) {
                        // Check direct file hit
                        filename = pathes.concat(scope.pathesConfiguration.sites, request.path);
                    } else {
                        filename = match.file.filename;
                    }
                    scope.logger.debug(
                        'Trying template ' + filename + ' for route ' + resolvedRoute
                    );
                }
                if (!filename.endsWith('.j2')) {
                    scope.logger.debug(
                        'Skipping route ' + resolvedRoute + ': only j2 template files allowed'
                    );
                    next();
                    return;
                }
                if (!templateContents && fs.existsSync(filename)) {
                    templateContents = fs.readFileSync(filename, { encoding: 'utf8' });
                }
                if (!templateContents) {
                    scope.logger.debug(
                        'Skipping route ' + resolvedRoute + ': missing template file ' + template
                    );
                    next();
                    return;
                }

                // Check authentication
                if (authenticate && !scope.server.authenticate(request, response, next)) {
                    scope.logger.debug(
                        'Skipping route ' + resolvedRoute + ': failed authorization'
                    );
                    return;
                }

                // Render
                scope.logger.debug('Rendering route ' + resolvedRoute);
                const templateShort = yield scope.pathesConfiguration.shorten(filename);
                const work = scope.cliLogger.work(
                    'Serving template <' + templateShort + '> for <' + request.url + '>'
                );
                scope.templateRenderer
                    .render(templateContents, filename, {}, valueObjects, request)
                    .then((html) => {
                        response.send(html);
                        scope.cliLogger.end(work);
                    });
            });
        };
        if (this.server) {
            this.cliLogger.info(
                'Adding template route <' + resolvedRoute + '> for template <' + template + '>'
            );
            this.server.express.all(resolvedRoute, handler);
        } else {
            this._templateHandlers.push({
                route: resolvedRoute,
                handler: handler,
                message:
                    'Adding template route <' + resolvedRoute + '> for template <' + template + '>'
            });
        }
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.TemplateRoute = TemplateRoute;
