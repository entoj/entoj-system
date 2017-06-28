'use strict';

/**
 * Requirements
 * @ignore
 */
const BaseMixin = require('../Base.js').BaseMixin;
const FileLoader = require('./loader/FileLoader.js').FileLoader;
const BuildConfiguration = require('../model/configuration/BuildConfiguration.js').BuildConfiguration;
const EntitiesRepository = require('../model/entity/EntitiesRepository.js').EntitiesRepository;
const PathesConfiguration = require('../model/configuration/PathesConfiguration.js').PathesConfiguration;
const Template = require('./Template.js').Template;
const assertParameter = require('../utils/assert.js').assertParameter;
const waitForPromise = require('../utils/synchronize.js').waitForPromise;
const nunjucks = require('nunjucks');


/**
 * @memberOf nunjucks
 */
class Environment extends BaseMixin(nunjucks.Environment)
{
    /**
     * @param {EntitiesRepository} entitiesRepository
     * @param {BuildConfiguration} buildConfiguration
     * @param {Array} filters
     * @param {Object} options
     */
    constructor(entitiesRepository, pathesConfiguration, buildConfiguration, filters, options)
    {
        const opts = options || {};
        opts.autoescape = false;
        super([], opts);

        // Check params
        assertParameter(this, 'entitiesRepository', entitiesRepository, true, EntitiesRepository);
        assertParameter(this, 'pathesConfiguration', pathesConfiguration, true, PathesConfiguration);
        assertParameter(this, 'buildConfiguration', buildConfiguration, true, BuildConfiguration);

        // Add options
        this._buildConfiguration = buildConfiguration;
        this._pathesConfiguration = pathesConfiguration;
        this._filters = filters || [];
        this._basePath = waitForPromise(pathesConfiguration.resolve(opts.path || opts.basePath || ''));
        this._loader = new FileLoader(this._basePath, entitiesRepository, buildConfiguration);
        this._template = new Template(entitiesRepository, this.basePath, this._buildConfiguration.environment);

        // Add loader
        this.loaders.push(this._loader);

        // Add globals
        this.addGlobal('environment', this._buildConfiguration);

        // Add filters
        for (const filter of this._filters)
        {
            filter.register(this);
        }
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [EntitiesRepository, PathesConfiguration, BuildConfiguration,
            'nunjucks/Environment.filters', 'nunjucks/Environment.options'] };
    }


    /**
     * The namespaced class name
     *
     * @type {string}
     * @static
     */
    static get className()
    {
        return 'nunjucks/Environment';
    }


    /**
     * Returns the templates root path used for resolving templates.
     *
     * @type {string}
     */
    get basePath()
    {
        return this._basePath;
    }


    /**
     * @type {string}
     */
    set basePath(value)
    {
        this._basePath = waitForPromise(this.pathesConfiguration.resolve(value));
        this._loader.setSearchPaths(value);
        this._template._basePath = value;
    }


    /**
     * @type {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration()
    {
        return this._pathesConfiguration;
    }


    /**
     * @type {model.configuration.BuildConfiguration}
     */
    get buildConfiguration()
    {
        return this._buildConfiguration;
    }


    /**
     * @type {string}
     */
    renderString(content, context, callback)
    {
        const template = this._template.prepare(content, this.buildConfiguration.environment);
        const result = super.renderString(template, context, callback);
        this.logger.verbose('renderString\n', result);
        return result;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.Environment = Environment;
