'use strict';

/**
 * Requirements
 * @ignore
 */
const Route = require('./Route.js').Route;
const CliLogger = require('../../cli/CliLogger.js').CliLogger;
const PathesConfiguration = require('../../model/configuration/PathesConfiguration.js').PathesConfiguration;
const assertParameter = require('../../utils/assert.js').assertParameter;
const waitForPromise = require('../../utils/synchronize.js').waitForPromise;


/**
 * A route so serve static files
 *
 * @memberOf server.routes
 */
class StaticFileRoute extends Route
{
    /**
     * @param {cli.CliLogger} cliLogger
     */
    constructor(cliLogger, pathesConfiguration, options)
    {
        super(cliLogger.createPrefixed('routes.staticroute'));


        // Check params
        assertParameter(this, 'pathesConfiguration', pathesConfiguration, true, PathesConfiguration);

        // Assign options
        const opts = options || {};
        this._basePath = waitForPromise(pathesConfiguration.resolve(opts.basePath || ''));
        this._allowedExtensions = opts.allowedExtensions || ['.css', '.png', '.jpg', '.gif', '.svg', '.woff', '.woff2', '.json', '.ico', '.html'];
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [CliLogger, PathesConfiguration, 'server.route/StaticFileRoute.options'] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'server.route/StaticFileRoute';
    }


    /**
     * The base path to search for files
     *
     * @type {String}
     */
    get basePath()
    {
        return this._basePath;
    }


    /**
     * A list of allowed file extensions.
     *
     * @type {Array}
     */
    get allowedExtensions()
    {
        return this._allowedExtensions;
    }


    /**
     * @inheritDocs
     */
    register(server)
    {
        const promise = super.register(server);
        promise.then(() =>
        {
            this.addStaticFileHandler('*', this.basePath, this.allowedExtensions);
        });
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.StaticFileRoute = StaticFileRoute;
