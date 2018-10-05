'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;
const CliLogger = require('../../cli/CliLogger.js').CliLogger;
const assertParameter = require('../../utils/assert.js').assertParameter;
const path = require('path');
const fs = require('fs');

/**
 * @memberOf server.routes
 */
class Route extends Base {
    /**
     * @param {cli.CliLogger} cliLogger
     */
    constructor(cliLogger) {
        super();

        // Check params
        assertParameter(this, 'cliLogger', cliLogger, true, CliLogger);

        // Assign options
        this._cliLogger = cliLogger;
        this._server = undefined;
    }

    /**
     * @inheritDocs
     */
    static get injections() {
        return { parameters: [CliLogger] };
    }

    /**
     * @inheritDocs
     */
    static get className() {
        return 'server.route/Route';
    }

    /**
     * @type {cli.CliLogger}
     */
    get cliLogger() {
        return this._cliLogger;
    }

    /**
     * @type {cli.CliLogger}
     */
    set cliLogger(value) {
        assertParameter(this, 'cliLogger', value, true, CliLogger);
        this._cliLogger = value;
    }

    /**
     * @type {express}
     */
    get server() {
        return this._server;
    }

    /**
     * @return {void}
     */
    afterRegistration() {}

    /**
     * Adds a route to static files located at basePath
     *
     * @protected
     * @param {String} route
     * @param {String|Function} basePath
     * @param {Array} allowedExtensions
     * @param {Function} pathTransformer
     */
    addStaticFileHandler(route, basePath, allowedExtensions, pathTransformer) {
        if (allowedExtensions && allowedExtensions.length) {
            this.cliLogger.info(
                'Adding static file route <' +
                    route +
                    '> searching for [' +
                    allowedExtensions.join(', ') +
                    '] in <' +
                    (typeof basePath === 'string' ? basePath : 'function') +
                    '>'
            );
        } else {
            this.cliLogger.info(
                'Adding static file route <' +
                    route +
                    '> searching in <' +
                    (typeof basePath === 'string' ? basePath : 'function') +
                    '>'
            );
        }
        if (!basePath) {
            throw Error(
                this.className +
                    '::addStaticFileHandler basePath is for ' +
                    route +
                    ' is not defined!'
            );
        }
        const handler = (request, response, next) => {
            // Check extension
            if (Array.isArray(allowedExtensions)) {
                const extension = path.extname(request.path);
                if (allowedExtensions.indexOf(extension) === -1) {
                    this.logger.debug('Extension not matching', request.path);
                    next();
                    return;
                }
            }

            // Check if file exists
            const filename =
                typeof basePath === 'string'
                    ? path.join(basePath, request.path)
                    : basePath(request.path, request);
            if (!filename || !fs.existsSync(filename)) {
                this.logger.debug('File not found', request.path);
                next();
                return;
            }

            // Serve it
            const work = this.cliLogger.work(
                'Serving <' + request.path + '> from <' + filename + '>'
            );
            response.sendFile(filename);
            this.cliLogger.end(work);
        };
        if (this.server) {
            this.server.express.all(route, handler);
        }
    }

    /**
     * Register the route on teh given espress instance
     *
     * @param {Express}
     * @return {Promise}
     */
    register(server) {
        this._server = server;
        this.afterRegistration();
        return Promise.resolve();
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.Route = Route;
