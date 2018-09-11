'use strict';

/**
 * Requirements
 * @ignore
 */
const Route = require('./Route.js').Route;
const UrlsConfiguration = require('../../model/configuration/UrlsConfiguration.js')
    .UrlsConfiguration;
const GlobalConfiguration = require('../../model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const PathesConfiguration = require('../../model/configuration/PathesConfiguration.js')
    .PathesConfiguration;
const BuildConfiguration = require('../../model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const EntitiesRepository = require('../../model/entity/EntitiesRepository.js').EntitiesRepository;
const EntityCategoriesRepository = require('../../model/entity/EntityCategoriesRepository.js')
    .EntityCategoriesRepository;
const SitesRepository = require('../../model/site/SitesRepository.js').SitesRepository;
const CliLogger = require('../../cli/CliLogger.js').CliLogger;
const Environment = require('../../nunjucks/Environment.js').Environment;
const assertParameter = require('../../utils/assert.js').assertParameter;
const synchronize = require('../../utils/synchronize.js').synchronize;
const waitForPromise = require('../../utils/synchronize.js').waitForPromise;
const co = require('co');
const fs = require('fs');
const path = require('path');

/**
 * @memberOf server.route
 */
class GuiTemplateRoute extends Route {
    /**
     * @param {cli.CliLogger} cliLogger
     * @param {model.site.SitesRepository} sitesRepository
     * @param {model.entity.EntityCategoriesRepository} entityCategoriesRepository
     * @param {model.entity.EntitiesRepository} entitiesRepository
     * @param {model.configuration.GlobalConfiguration} globalConfiguration
     * @param {model.configuration.UrlsConfiguration} urlsConfiguration
     * @param {model.configuration.PathesConfiguration} pathesConfiguration
     * @param {model.configuration.BuildConfiguration} buildConfiguration
     * @param {nunjucks.Environment} nunjucks
     * @param {array} routes
     * @param {object} [options]
     */
    constructor(
        cliLogger,
        sitesRepository,
        entityCategoriesRepository,
        entitiesRepository,
        globalConfiguration,
        urlsConfiguration,
        pathesConfiguration,
        buildConfiguration,
        nunjucks,
        routes,
        options
    ) {
        super(cliLogger.createPrefixed('routes.guiroute'));

        // Check params
        assertParameter(this, 'sitesRepository', sitesRepository, true, SitesRepository);
        assertParameter(
            this,
            'entityCategoriesRepository',
            entityCategoriesRepository,
            true,
            EntityCategoriesRepository
        );
        assertParameter(this, 'entitiesRepository', entitiesRepository, true, EntitiesRepository);
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
            'globalConfiguration',
            globalConfiguration,
            true,
            GlobalConfiguration
        );
        assertParameter(this, 'buildConfiguration', buildConfiguration, true, BuildConfiguration);
        assertParameter(this, 'nunjucks', nunjucks, true, Environment);

        // Assign options
        this._sitesRepository = sitesRepository;
        this._entityCategoriesRepository = entityCategoriesRepository;
        this._entitiesRepository = entitiesRepository;
        this._urlsConfiguration = urlsConfiguration;
        this._pathesConfiguration = pathesConfiguration;
        this._buildConfiguration = buildConfiguration;
        this._nunjucks = nunjucks;
        this._defaultModel = {
            sites: synchronize(sitesRepository),
            entityCategories: synchronize(entityCategoriesRepository),
            entities: synchronize(entitiesRepository),
            urls: synchronize(urlsConfiguration),
            configuration: synchronize(globalConfiguration)
        };

        // Routes
        this._routes = [];
        if (routes && Array.isArray(routes)) {
            for (const routeConfig of routes) {
                const route = {
                    url: routeConfig.url || '/',
                    template: routeConfig.template || 'index.j2'
                };
                this._routes.push(route);
            }
        }

        // Options
        const opts = options || {};
        this.templatePaths = opts.templatePaths || __dirname;
        this._staticRoute = opts.staticRoute || '/internal';

        // Configure nunjucks
        this._nunjucks.templatePaths = this.templatePaths;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [
                CliLogger,
                SitesRepository,
                EntityCategoriesRepository,
                EntitiesRepository,
                GlobalConfiguration,
                UrlsConfiguration,
                PathesConfiguration,
                BuildConfiguration,
                Environment,
                'server.route/PagesRoute.routes',
                'server.route/PagesRoute.options'
            ]
        };
    }

    /**
     * @inheritDocs
     */
    static get className() {
        return 'server.route/PagesRoute';
    }

    /**
     * @type {Object}
     */
    static get model() {
        if (!GuiTemplateRoute.__model) {
            GuiTemplateRoute.__model = {};
        }
        return GuiTemplateRoute.__model;
    }

    /**
     * @type {Object}
     */
    get defaultModel() {
        return this._defaultModel;
    }

    /**
     * @type {Array}
     */
    get templatePaths() {
        return this._templatePaths;
    }

    /**
     * @type {Array}
     */
    set templatePaths(value) {
        this._templatePaths = [];
        if (Array.isArray(value)) {
            for (const templatePath of value) {
                this._templatePaths.push(
                    waitForPromise(this.pathesConfiguration.resolve(templatePath))
                );
            }
        } else {
            this._templatePaths.push(waitForPromise(this.pathesConfiguration.resolve(value || '')));
        }
    }

    /**
     * @type {nunjucks.Environment}
     */
    get nunjucks() {
        return this._nunjucks;
    }

    /**
     * @type {model.site.SitesRepository}
     */
    get sitesRepository() {
        return this._sitesRepository;
    }

    /**
     * @type {model.entity.EntityCategoriesRepository}
     */
    get entityCategoriesRepository() {
        return this._entityCategoriesRepository;
    }

    /**
     * @type {model.entity.EntitiesRepository}
     */
    get entitiesRepository() {
        return this._entitiesRepository;
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
     * @inheritDocs
     */
    renderTemplate(filename, request, model) {
        const tpl = fs.readFileSync(filename, { encoding: 'utf8' });
        this.nunjucks.addGlobal('request', request);
        this.nunjucks.addGlobal('global', Object.assign({}, GuiTemplateRoute.model, model));
        this.nunjucks.addGlobal('ContentKind', require('../../model/ContentKind.js').ContentKind);
        this.nunjucks.addGlobal(
            'DocumentationType',
            require('../../model/documentation/DocumentationType.js').DocumentationType
        );
        const result = this.nunjucks.renderString(tpl);
        return result;
    }

    /**
     * @inheritDocs
     */
    addTemplateHandler(route, template, authenticate, resolver) {
        this.cliLogger.info(
            'Adding template route <' + route + '> for template <' + template + '>'
        );
        const scope = this;
        const handler = (request, response, next) => {
            co(function*() {
                scope.logger.trace('Trying route ' + route + ' for template ' + template);

                const model = Object.assign({}, scope.defaultModel);
                model.location = {
                    url: request.url
                };

                // Create a short url for simple model matches
                const url = request.url
                    .split('/')
                    .slice(0, 4)
                    .join('/');

                // Get site
                const site = yield scope.urlsConfiguration.matchSite(url, true);
                if (site) {
                    model.location.site = site.site;
                }

                // Get entityCategory
                const entityCategory = yield scope.urlsConfiguration.matchEntityCategory(url, true);
                if (entityCategory) {
                    model.location.entityCategory = entityCategory.entityCategory;
                }

                // Get entity
                const entity = yield scope.urlsConfiguration.matchEntityId(url);
                if (entity) {
                    model.location.entity = entity.entity;
                }

                // Apply resolver
                if (typeof resolver === 'function') {
                    yield resolver(this, request, model);
                }

                // Check if valid page
                if (request.params.entityId === 'examples') {
                    scope.logger.trace('Skipping route ' + route + ': examples');
                    next();
                    return;
                }
                if (request.params.site && !model.location.site) {
                    scope.logger.trace('Skipping route ' + route + ': missing site');
                    next();
                    return;
                }
                if (
                    !request.params.entityId &&
                    request.params.entityCategory &&
                    !model.location.entityCategory
                ) {
                    scope.logger.trace('Skipping route ' + route + ': missing entityCategory');
                    next();
                    return;
                }
                if (request.params.entityId && !model.location.entity) {
                    scope.logger.trace('Skipping route ' + route + ': missing entity');
                    next();
                    return;
                }

                // See if file exists
                let filename = false;
                for (const templatePath of scope.templatePaths) {
                    if (!filename) {
                        filename = path.join(templatePath, '/' + template);
                        if (!fs.existsSync(filename)) {
                            filename = false;
                        }
                    }
                }
                if (!filename) {
                    scope.logger.trace('Skipping route ' + route + ': missing template file');
                    next();
                    return;
                }

                // Check authentication
                if (authenticate && !scope.server.authenticate(request, response, next)) {
                    scope.logger.trace('Skipping route ' + route + ': failed autohorization');
                    return;
                }

                // Render
                scope.logger.trace('Rendering route ' + route);
                const templateShort = yield scope.pathesConfiguration.shorten(template);
                const work = scope.cliLogger.work(
                    'Serving template <' + templateShort + '> for <' + request.url + '>'
                );
                const html = scope.renderTemplate(filename, request, model);
                response.send(html);
                scope.cliLogger.end(work);
            });
        };
        this.server.express.all(route, handler);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.GuiTemplateRoute = GuiTemplateRoute;
