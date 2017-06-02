'use strict';

/**
 * Requirements
 * @ignore
 */
const BaseMixin = require('../Base.js').BaseMixin;
const FileLoader = require('./loader/FileLoader.js').FileLoader;
const BuildConfiguration = require('../model/configuration/BuildConfiguration.js').BuildConfiguration;
const EntitiesRepository = require('../model/entity/EntitiesRepository.js').EntitiesRepository;
const Template = require('./Template.js').Template;
const assertParameter = require('../utils/assert.js').assertParameter;
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
    constructor(entitiesRepository, buildConfiguration, filters, options)
    {
        const opts = options || {};
        opts.autoescape = false;
        super([], opts);

        // Check params
        assertParameter(this, 'entitiesRepository', entitiesRepository, true, EntitiesRepository);
        assertParameter(this, 'buildConfiguration', buildConfiguration, true, BuildConfiguration);

        // Add options
        this._entitiesRepository = entitiesRepository;
        this._buildConfiguration = buildConfiguration;
        this._filters = filters || [];
        this._basePath = opts.path || opts.basePath || '';
        this._loader = new FileLoader(this._basePath, entitiesRepository, buildConfiguration);
        this._template = new Template(this._entitiesRepository, this.basePath, this._buildConfiguration.environment);

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
        return { 'parameters': [EntitiesRepository, BuildConfiguration,
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
        this._basePath = value;
        this._loader.setSearchPaths(value);
        this._template._basePath = value;
    }


    /**
     * @type {string}
     */
    renderString(content, context, callback)
    {
        const template = this._template.prepare(content, this._buildConfiguration.environment);
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
