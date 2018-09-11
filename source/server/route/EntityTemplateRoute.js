'use strict';

/**
 * Requirements
 * @ignore
 */
const Route = require('./Route.js').Route;
const CliLogger = require('../../cli/CliLogger.js').CliLogger;
const BaseMap = require('../../base/BaseMap.js').BaseMap;
const ErrorHandler = require('../../error/ErrorHandler.js').ErrorHandler;
const UrlsConfiguration = require('../../model/configuration/UrlsConfiguration.js')
    .UrlsConfiguration;
const Environment = require('../../nunjucks/Environment.js').Environment;
const PathesConfiguration = require('../../model/configuration/PathesConfiguration.js')
    .PathesConfiguration;
const assertParameter = require('../../utils/assert.js').assertParameter;
const waitForPromise = require('../../utils/synchronize.js').waitForPromise;
const pathes = require('../../utils/pathes.js');
const co = require('co');
const fs = require('co-fs-extra');

/**
 * Page cache
 * @type {Map}
 */
const pages = new Map();
let pageCacheEnabled = false;

/**
 * Enables the page cache
 */
function enablePageCache() {
    pageCacheEnabled = true;
}

/**
 * Disables the page cache
 */
function disablePageCache() {
    pageCacheEnabled = false;
}

/**
 * A route to server any entity related nunjucks files
 *
 * @memberOf server.routes
 */
class EntityTemplateRoute extends Route {
    /**
     * @param {cli.CliLogger} cliLogger
     * @param {model.configuration.UrlsConfiguration} urlsConfiguration
     * @param {model.configuration.PathesConfiguration} pathesConfiguration
     * @param {nunjucks.Environment} nunjucks
     * @param {Object} options
     */
    constructor(cliLogger, urlsConfiguration, pathesConfiguration, nunjucks, options) {
        super(cliLogger.createPrefixed('routes.entityroute'));

        // Check params
        assertParameter(this, 'urlsConfiguration', urlsConfiguration, true, UrlsConfiguration);
        assertParameter(
            this,
            'pathesConfiguration',
            pathesConfiguration,
            true,
            PathesConfiguration
        );
        assertParameter(this, 'nunjucks', nunjucks, true, Environment);

        // Assign options
        const opts = options || {};
        this._pathesConfiguration = pathesConfiguration;
        this._urlsConfiguration = urlsConfiguration;
        this._nunjucks = nunjucks;
        this.templatePaths = opts.templatePaths || pathesConfiguration.sites;
    }

    /**
     * @inheritDocs
     */
    static get injections() {
        return {
            parameters: [
                CliLogger,
                UrlsConfiguration,
                PathesConfiguration,
                Environment,
                'server.route/EntityTemplateRoute.options'
            ]
        };
    }

    /**
     * @inheritDocs
     */
    static get className() {
        return 'server.route/EntityTemplateRoute';
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
        this.nunjucks.templatePaths = this._templatePaths;
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
     * @type {nunjucks.Environment}
     */
    get nunjucks() {
        return this._nunjucks;
    }

    /**
     * @returns Promise
     */
    renderTemplate(path, request) {
        const scope = this;
        const promise = co(function*() {
            // Check cache
            if (pageCacheEnabled) {
                if (pages.has(request.url)) {
                    const work = scope.cliLogger.work(
                        'Serving url <' + request.url + '> using cache'
                    );
                    const html = pages.get(request.url);
                    scope.cliLogger.end(work);
                    return html;
                }
            }

            // Check file hit
            let data = yield scope.urlsConfiguration.matchEntityFile(path);
            let filename;
            if (!data || !data.file) {
                // Check direct file hit
                filename = pathes.concat(scope.pathesConfiguration.sites, path);
                if (!fs.existsSync(filename)) {
                    return;
                }
                data = yield scope.urlsConfiguration.matchEntity(path, true);
            } else {
                filename = data.file.filename;
            }

            // Render
            const tpl = yield fs.readFile(filename, { encoding: 'utf8' });
            const filenameShort = yield scope.pathesConfiguration.shorten(filename);
            const work = scope.cliLogger.work('Rendering template <' + filenameShort + '>');
            let html;
            try {
                const location = {
                    site: data.site,
                    entity: data.entity,
                    customPath: data.customPath
                };
                scope.nunjucks.addGlobal('global', {});
                scope.nunjucks.addGlobal('location', location);
                scope.nunjucks.addGlobal('request', request);
                scope.nunjucks.addGlobal('__configuration__', new BaseMap());
                html = scope.nunjucks.renderString(tpl, data, { path: filename });
            } catch (e) {
                /* istanbul ignore next */
                scope.cliLogger.error(scope.className + '::renderTemplate', e);
                /* istanbul ignore next */
                return false;
            }
            scope.cliLogger.end(work);
            return html;
        });
        return promise;
    }

    /**
     * @inheritDocs
     */
    handleEntityTemplate(request, response, next) {
        const scope = this;
        const promise = co(function*() {
            // Check extension
            if (!request.path.endsWith('.j2')) {
                next();
                return;
            }

            // Check authentication
            if (!scope.server.authenticate(request, response, next)) {
                return;
            }

            // Check cache
            if (pageCacheEnabled) {
                if (pages.has(request.url)) {
                    const work = scope.cliLogger.work(
                        'Serving url <' + request.url + '> using cache'
                    );
                    response.send(pages.get(request.url));
                    scope.cliLogger.end(work);
                    return;
                }
            }

            // Render template
            const work = scope.cliLogger.work('Serving url <' + request.url + '>');
            const html = yield scope.renderTemplate(request.path, request);
            if (!html) {
                scope.cliLogger.end(work, 'Rendering template failed');
                next();
                return;
            }

            // Update cache
            if (pageCacheEnabled) {
                pages.set(request.url, html);
            }

            // Send
            response.send(html);
            scope.cliLogger.end(work);
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }

    /**
     * @inheritDocs
     */
    register(server) {
        const promise = super.register(server);
        promise.then(() => {
            if (server) {
                server.express.all('/:site/*', this.handleEntityTemplate.bind(this));
            }
        });
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.EntityTemplateRoute = EntityTemplateRoute;
module.exports.enablePageCache = enablePageCache;
module.exports.disablePageCache = disablePageCache;
