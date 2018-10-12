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
