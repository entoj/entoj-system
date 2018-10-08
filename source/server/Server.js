'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const BaseArray = require('../base/BaseArray.js').BaseArray;
const SystemModuleConfiguration = require('../configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const Route = require('./route/Route.js').Route;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const assertParameter = require('../utils/assert.js').assertParameter;
const express = require('express');
const fs = require('fs');
const http = require('http');
const spdy = require('spdy');
const basicAuth = require('basic-auth');
const compression = require('compression');
const bodyParser = require('body-parser');

/**
 * List of all currently running instances
 * @type {Array}
 */
const instances = new BaseArray();

/**
 * Provides a express based server with support for http2
 *
 * @class
 * @memberOf server
 * @extends Base
 */
class Server extends Base {
    /**
     * @param {CliLogger} cliLogger
     * @param {configuration.SystemModuleConfiguration} [moduleConfiguration]
     * @param {Array} [routes]
     */
    constructor(cliLogger, moduleConfiguration, routes) {
        super();

        // Check params
        assertParameter(this, 'cliLogger', cliLogger, true, CliLogger);
        assertParameter(
            this,
            'moduleConfiguration',
            moduleConfiguration,
            true,
            SystemModuleConfiguration
        );

        // Add initial values
        this._routes = [];
        this._cliLogger = cliLogger;
        this._moduleConfiguration = moduleConfiguration;
        this._express = express();

        // Add settings
        this.express.use(compression());
        this.express.use(bodyParser.json());

        // Add routes
        if (Array.isArray(routes)) {
            for (const route of routes) {
                this.addRoute(route);
            }
        }
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: [CliLogger, SystemModuleConfiguration, 'server/Server.routes'] };
    }

    /**
     * @inheritDocs
     */
    static get className() {
        return 'server/Server';
    }

    /**
     * List of all currently running instances
     * @type {Array}
     */
    static get instances() {
        return instances;
    }

    /**
     * @let {cli.CliLogger}
     */
    get cliLogger() {
        return this._cliLogger;
    }

    /**
     * @let {configuration.SystemModuleConfiuration}
     */
    get moduleConfiguration() {
        return this._moduleConfiguration;
    }

    /**
     * @let {Express}
     */
    get express() {
        return this._express;
    }

    /**
     * @let {Array}
     */
    get routes() {
        return this._routes;
    }

    /**
     * @let {Express}
     */
    get server() {
        return this._server;
    }

    /**
     * @param {server.route.Route}
     * @return {Promise}
     */
    authenticate(request, response, next) {
        if (this.moduleConfiguration.serverAuthentication) {
            const authed = basicAuth(request);
            if (
                !authed ||
                authed.name !== this.moduleConfiguration.serverUsername ||
                authed.pass !== this.moduleConfiguration.serverÜassword
            ) {
                response.statusCode = 401;
                response.setHeader('WWW-Authenticate', 'Basic realm="Patternlab"');
                response.end('Access denied');
                return false;
            }
        }

        // Ok
        return true;
    }

    /**
     * @param {server.route.Route}
     * @return {Promise}
     */
    addRoute(route) {
        // Check params
        assertParameter(this, 'route', route, true, Route);

        // Register
        this.routes.push(route);
        return route.register(this);
    }

    /**
     * @returns {Promise.<Express>}
     */
    start() {
        if (this.server) {
            return Promise.resolve(this.server);
        }

        const scope = this;
        return new Promise(function(resolve, reject) {
            if (scope.moduleConfiguration.serverHttp2) {
                const options = {
                    key: fs.readFileSync(scope.moduleConfiguration.serverSslKey),
                    cert: fs.readFileSync(scope.moduleConfiguration.serverSslCert)
                };
                const work = scope.cliLogger.work(
                    'Starting <http/2> server at <https://localhost:' +
                        scope.moduleConfiguration.serverPort +
                        '>'
                );
                scope._server = spdy
                    .createServer(options, scope.express)
                    .listen(scope.moduleConfiguration.serverPort);
                scope.cliLogger.end(work);
            } else {
                const work = scope.cliLogger.info(
                    'Starting <http> server at <http://localhost:' +
                        scope.moduleConfiguration.serverPort +
                        '>'
                );
                scope._server = http
                    .createServer(scope.express)
                    .listen(scope.moduleConfiguration.serverPort);
                scope.cliLogger.end(work);
            }
            Server.instances.push(scope);
            resolve(scope.server);
        });
    }

    /**
     * @returns {Promise.<Bool>}
     */
    stop() {
        const scope = this;
        return new Promise(function(resolve, reject) {
            if (scope.server) {
                scope.cliLogger.info('Server: Stopping');
                scope.server.close(function() {
                    scope._server = false;
                    Server.instances.remove(scope);
                    resolve();
                });
            } else {
                /* istanbul ignore next */
                resolve(false);
            }
        });
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.Server = Server;
