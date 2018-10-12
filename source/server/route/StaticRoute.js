'use strict';

/**
 * Requirements
 * @ignore
 */
const Route = require('./Route.js').Route;
const CliLogger = require('../../cli/CliLogger.js').CliLogger;
const SystemModuleConfiguration = require('../../configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const PathesConfiguration = require('../../model/configuration/PathesConfiguration.js')
    .PathesConfiguration;
const assertParameter = require('../../utils/assert.js').assertParameter;
const waitForPromise = require('../../utils/synchronize.js').waitForPromise;
const fs = require('fs');
const path = require('path');

/**
 * A route to serve static files
 *
 * @memberOf server.routes
 */
class StaticRoute extends Route {
    /**
     * @param {cli.CliLogger} cliLogger
     * @param {model.configuration.PathesConfiguration} pathesConfiguration
     * @param {configuration.SystemModuleConfiguration} moduleConfiguration
     * @param {Array} allowedStaticExtensions
     * @param {Array} staticPaths
     * @param {Array} staticHandlers
     */
    constructor(
        cliLogger,
        pathesConfiguration,
        moduleConfiguration,
        allowedStaticExtensions,
        staticPaths,
        staticHandlers
    ) {
        super(cliLogger.createPrefixed('routes.static'));

        // Check
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

        // Assign options
        this._moduleConfiguration = moduleConfiguration;
        this._pathesConfiguration = pathesConfiguration;
        this._staticPaths = [];
        this._staticHandlers = [];
        this._allowedStaticExtensions =
            allowedStaticExtensions || this.moduleConfiguration.serverAllowedStaticExtensions;

        // Add static pathes
        if (staticPaths) {
            this.addStaticPath(staticPaths);
        }

        // Add static handlers
        if (Array.isArray(staticHandlers)) {
            for (const staticHandler of staticHandlers) {
                this.addStaticHandler(
                    staticHandler.route,
                    staticHandler.extensions,
                    staticHandler.authenticate
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
                PathesConfiguration,
                SystemModuleConfiguration,
                'server.route/StaticRoute.allowedStaticExtensions',
                'server.route/StaticRoute.staticPaths',
                'server.route/StaticRoute.staticHandlers'
            ]
        };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'server.route/StaticRoute';
    }

    /**
     * @type {Array}
     */
    get staticPaths() {
        return this._staticPaths;
    }

    /**
     * @type {configuration.SystemModuleConfiguration}
     */
    get moduleConfiguration() {
        return this._moduleConfiguration;
    }

    /**
     * @type {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration() {
        return this._pathesConfiguration;
    }

    /**
     * @inheritDoc
     */
    afterRegistration() {
        if (this.server) {
            for (const handler of this._staticHandlers) {
                this.cliLogger.info(handler.message);
                this.server.express.all(handler.route, handler.handler);
            }
        }
    }

    /**
     * Adds the given pathes to staticPaths
     */
    addStaticPath(...staticPaths) {
        for (const staticPath of staticPaths) {
            if (Array.isArray(staticPath)) {
                this.addStaticPath(...staticPath);
            } else {
                const resolvedPath = waitForPromise(this.pathesConfiguration.resolve(staticPath));
                if (this._staticPaths.indexOf(resolvedPath) == -1) {
                    this._staticPaths.push(resolvedPath);
                }
            }
        }
    }

    /**
     * @inheritDoc
     */
    addStaticHandler(route, allowedStaticExtensions, authenticate) {
        const resolvedRoute = this.moduleConfiguration.resolveConfiguration(route);
        const allowedExtensions = allowedStaticExtensions || this._allowedStaticExtensions;
        const scope = this;
        const handler = (request, response, next) => {
            scope.logger.debug('Trying route ' + resolvedRoute + ' for ' + allowedExtensions);

            // Check extension
            const extension = path.extname(request.path);
            if (allowedExtensions.indexOf(extension) === -1) {
                this.logger.debug('Extension not matching', request.path);
                next();
                return;
            }

            // Check if file exists
            let filename = false;
            for (const staticPath of scope.staticPaths) {
                if (!filename) {
                    filename = path.join(staticPath, request.path);
                    scope.logger.debug('Trying asset ' + filename + ' for route ' + resolvedRoute);
                }
            }
            if (!filename || !fs.existsSync(filename)) {
                this.logger.debug('File not found', request.path);
                next();
                return;
            }

            // Check authentication
            if (authenticate && !scope.server.authenticate(request, response, next)) {
                scope.logger.debug('Skipping route ' + resolvedRoute + ': failed authorization');
                return;
            }

            // Render
            scope.logger.debug('Rendering route ' + resolvedRoute);
            const work = this.cliLogger.work(
                'Serving <' + request.path + '> from <' + filename + '>'
            );
            response.sendFile(filename);
            this.cliLogger.end(work);
        };
        if (this.server) {
            this.cliLogger.info(
                'Adding static route <' +
                    resolvedRoute +
                    '> for extensions <' +
                    allowedExtensions +
                    '>'
            );
            this.server.express.all(resolvedRoute, handler);
        } else {
            this._staticHandlers.push({
                route: resolvedRoute,
                handler: handler,
                message:
                    'Adding static route <' +
                    resolvedRoute +
                    '> for extensions <' +
                    allowedExtensions +
                    '>'
            });
        }
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.StaticRoute = StaticRoute;
