'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const UrlsConfiguration = require('../model/configuration/UrlsConfiguration.js').UrlsConfiguration;
const Environment = require('./Environment.js').Environment;
const PathesConfiguration = require('../model/configuration/PathesConfiguration.js').PathesConfiguration;
const assertParameter = require('../utils/assert.js').assertParameter;
const waitForPromise = require('../utils/synchronize.js').waitForPromise;
const pathes = require('../utils/pathes.js');
const co = require('co');
const fs = require('co-fs-extra');


/**
 * @memberOf nunjucks
 */
class EntityRenderer extends Base
{
    /**
     * @param {model.configuration.UrlsConfiguration} urlsConfiguration
     * @param {model.configuration.PathesConfiguration} pathesConfiguration
     * @param {nunjucks.Environment} nunjucks
     * @param {Object} options
     */
    constructor(urlsConfiguration, pathesConfiguration, nunjucks, options)
    {
        super();

        // Check params
        assertParameter(this, 'urlsConfiguration', urlsConfiguration, true, UrlsConfiguration);
        assertParameter(this, 'pathesConfiguration', pathesConfiguration, true, PathesConfiguration);
        assertParameter(this, 'nunjucks', nunjucks, true, Environment);

        // Assign options
        const opts = options || {};
        this._pathesConfiguration = pathesConfiguration;
        this._urlsConfiguration = urlsConfiguration;
        this._nunjucks = nunjucks;
        this.templatePaths = opts.templatePaths || pathesConfiguration.sites;
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [UrlsConfiguration, PathesConfiguration, Environment, 'nunjucks/EntityRenderer.options'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks/EntityRenderer';
    }


    /**
     * @type {Array}
     */
    get templatePaths()
    {
        return this._templatePaths;
    }


    /**
     * @type {Array}
     */
    set templatePaths(value)
    {
        this._templatePaths = [];
        if (Array.isArray(value))
        {
            for (const templatePath of value)
            {
                this._templatePaths.push(waitForPromise(this.pathesConfiguration.resolve(templatePath)));
            }
        }
        else
        {
            this._templatePaths.push(waitForPromise(this.pathesConfiguration.resolve(value || '')));
        }
        this.nunjucks.templatePaths = this._templatePaths;
    }


    /**
     * @type {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration()
    {
        return this._pathesConfiguration;
    }


    /**
     * @type {model.configuration.UrlsConfiguration}
     */
    get urlsConfiguration()
    {
        return this._urlsConfiguration;
    }


    /**
     * @type {nunjucks.Environment}
     */
    get nunjucks()
    {
        return this._nunjucks;
    }


    /**
     * @param {String} path
     * @param {Object} data
     * @param {Object} globals
     * @returns Promise<String>
     */
    renderForUrl(path, data, globals)
    {
        const scope = this;
        const promise = co(function *()
        {
            // Check file hit
            let match = yield scope.urlsConfiguration.matchEntityFile(path);
            let filename;
            if (!match || !match.file)
            {
                // Check direct file hit
                filename = pathes.concat(scope.pathesConfiguration.sites, path);
                if (!fs.existsSync(filename))
                {
                    return false;
                }
                match = yield scope.urlsConfiguration.matchEntity(path, true);
            }
            else
            {
                filename = match.file.filename;
            }
            // Render
            const tpl = yield fs.readFile(filename, { encoding: 'utf8' });
            const location =
            {
                site: match.site,
                entity: match.entity,
                customPath: match.customPath
            };
            scope.nunjucks.addGlobal('global', {});
            scope.nunjucks.addGlobal('location', location);
            if (globals)
            {
                for (const key in globals)
                {
                    scope.nunjucks.addGlobal(key, globals[key]);
                }
            }
            const html = scope.nunjucks.renderString(tpl, data, { path: filename });
            return html;
        });
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EntityRenderer = EntityRenderer;
