'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const Route = require('./route/Route.js').Route;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const assertParameter = require('../utils/assert.js').assertParameter;
const express = require('express');
const fs = require('fs');
const http = require('http');
const spdy = require('spdy');
const basicAuth = require('basic-auth-connect');
const compression = require('compression');
const bodyParser = require('body-parser');


/**
 * Provides a express based server with support for http2
 *
 * @class
 * @memberOf server
 * @extends Base
 */
class Server extends Base
{
    /**
     * @param {CliLogger} cliLogger
     * @param {object} [routes]
     * @param {object} [options]
     */
    constructor(cliLogger, routes, options)
    {
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
        this._sslKey = opts.sslKey || (__dirname + '/localhost.key');
        this._sslCert = opts.sslCert || (__dirname + '/localhost.crt');

        // Add settings
        this.express.use(compression());
        this.express.use(bodyParser.json());

        // Add basic auth
        if (opts.authentication === true)
        {
            const credentials = opts.credentials || { username: 'entoj', password: 'entoj' };
            this.express.use(basicAuth(credentials.username, credentials.password));
        }

        // Add routes
        if (Array.isArray(routes))
        {
            for (const route of routes)
            {
                this.addRoute(route);
            }
        }
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [CliLogger, 'server/Server.routes', 'server/Server.options'] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'server/Server';
    }


    /**
     * @let {cli.CliLogger}
     */
    get cliLogger()
    {
        return this._cliLogger;
    }


    /**
     * @let {String}
     */
    get port()
    {
        return this._port;
    }


    /**
     * @let {String}
     */
    get http2()
    {
        return this._http2;
    }


    /**
     * @let {Express}
     */
    get express()
    {
        return this._express;
    }


    /**
     * @let {Array}
     */
    get routes()
    {
        return this._routes;
    }


    /**
     * @param {server.routes.BaseRoute}
     */
    addRoute(route)
    {
        // Check params
        assertParameter(this, 'route', route, true, Route);

        // Register
        this.routes.push(route);
        route.register(this.express);
    }


    /**
     * @returns {Promise.<Express>}
     */
    start()
    {
        const scope = this;
        return new Promise(function(resolve, reject)
        {
            if (scope.http2)
            {
                const options =
                {
                    key: fs.readFileSync(scope._sslKey),
                    cert: fs.readFileSync(scope._sslCert)
                };
                const work = scope._cliLogger.work('Starting <http/2> server at <https://localhost:' + scope.port + '>');
                scope._server = spdy.createServer(options, scope.express).listen(scope.port);
                scope.cliLogger.end(work);
            }
            else
            {
                const work = scope._cliLogger.info('Starting <http> server at <http://localhost:' + scope.port + '>');
                scope._server = http.createServer(scope.express).listen(scope.port);
                scope.cliLogger.end(work);
            }
            resolve(scope._server);
        });
    }


    /**
     * @returns {Promise.<Bool>}
     */
    stop()
    {
        const scope = this;
        return new Promise(function(resolve, reject)
        {
            if (scope._server)
            {
                scope._cliLogger.info('Server: Stopping');
                scope._server.close(function()
                {
                    resolve(scope._server);
                });
            }
            else
            {
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
