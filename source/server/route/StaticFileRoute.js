'use strict';

/**
 * Requirements
 * @ignore
 */
const Route = require('./Route.js').Route;
const CliLogger = require('../../cli/CliLogger.js').CliLogger;


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
    constructor(cliLogger, options)
    {
        super(cliLogger);

        // Assign options
        const opts = options || {};
        this._basePath = opts.basePath || '';
        this._allowedExtensions = opts.allowedExtensions || ['.css', '.png', '.jpg', '.gif', '.svg', '.woff', '.json', '.ico', '.html'];
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [CliLogger, 'server.route/StaticFileRoute.options'] };
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
    register(express)
    {
        const promise = super.register(express);
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
