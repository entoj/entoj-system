'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const BaseArray = require('../base/BaseArray.js').BaseArray;
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
     * @param {object} [routes]
     * @param {object} [options]
     */
    constructor(cliLogger, routes, options) {
        super();

        // Check params
        assertParameter(this, 'cliLogger', cliLogger, true, CliLogger);

        // Add initial values
        const opts = options || {};
        this._cliLogger = cliLogger;
        this._http2 = opts.http2 || false;
        this._port = opts.port || 3000;
        this._express = express();
        this._routes = [];
        this._sslKey = opts.sslKey || __dirname + '/localhost.key';
        this._sslCert = opts.sslCert || __dirname + '/localhost.crt';
        this._baseUrl = 'http' + (this._http2 ? 's' : '') + '://localhost:' + this._port;
        this.options = opts;
        this.options.authentication = opts.authentication || false;
        this.options.credentials = opts.credentials || { username: 'entoj', password: 'entoj' };

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
        return { parameters: [CliLogger, 'server/Server.routes', 'server/Server.options'] };
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
     * @let {String}
     */
    get port() {
        return this._port;
    }

    /**
     * @let {String}
     */
    get http2() {
        return this._http2;
    }

    /**
     * @let {String}
     */
    get baseUrl() {
        return this._baseUrl;
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
        if (this.options.authentication) {
            const authed = basicAuth(request);
            if (
                !authed ||
                authed.name !== this.options.credentials.username ||
                authed.pass !== this.options.credentials.password
            ) {
                response.statusCode = 401;
                response.setHeader('WWW-Authenticate', 'Basic realm="example"');
                response.end('Access denied');
                next();
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
            if (scope.http2) {
                const options = {
                    key: fs.readFileSync(scope._sslKey),
                    cert: fs.readFileSync(scope._sslCert)
                };
                const work = scope.cliLogger.work(
                    'Starting <http/2> server at <https://localhost:' + scope.port + '>'
                );
                scope._server = spdy.createServer(options, scope.express).listen(scope.port);
                scope.cliLogger.end(work);
            } else {
                const work = scope.cliLogger.info(
                    'Starting <http> server at <http://localhost:' + scope.port + '>'
                );
                scope._server = http.createServer(scope.express).listen(scope.port);
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
