'use strict';

/**
 * Requirements
 * @ignore
 */
const BaseMixin = require('../Base.js').BaseMixin;
const FileLoader = require('./loader/FileLoader.js').FileLoader;
const BuildConfiguration = require('../model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const EntitiesRepository = require('../model/entity/EntitiesRepository.js').EntitiesRepository;
const PathesConfiguration = require('../model/configuration/PathesConfiguration.js')
    .PathesConfiguration;
const Template = require('./Template.js').Template;
const Filter = require('./filter/Filter.js').Filter;
const assertParameter = require('../utils/assert.js').assertParameter;
const waitForPromise = require('../utils/synchronize.js').waitForPromise;
const nunjucks = require('nunjucks');

/**
 * @memberOf nunjucks
 */
class Environment extends BaseMixin(nunjucks.Environment) {
    /**
     * @param {EntitiesRepository} entitiesRepository
     * @param {PathesConfiguration} pathesConfiguration
     * @param {BuildConfiguration} buildConfiguration
     * @param {Array} filters
     * @param {Array} tags
     * @param {Object} options
     */
    constructor(
        entitiesRepository,
        pathesConfiguration,
        buildConfiguration,
        filters,
        tags,
        options
    ) {
        const opts = options || {};
        opts.autoescape = false;
        super([], opts);

        // Check params
        assertParameter(this, 'entitiesRepository', entitiesRepository, true, EntitiesRepository);
        assertParameter(
            this,
            'pathesConfiguration',
            pathesConfiguration,
            true,
            PathesConfiguration
        );
        assertParameter(this, 'buildConfiguration', buildConfiguration, true, BuildConfiguration);

        // Add options
        this._buildConfiguration = buildConfiguration;
        this._pathesConfiguration = pathesConfiguration;
        this._filters = filters || [];
        this._tags = tags || [];
        this.templatePaths = opts.templatePaths;
        this._template = new Template(
            entitiesRepository,
            this.templatePaths,
            this.buildConfiguration.environment
        );
        this._loader = new FileLoader(this.templatePaths, this._template, this);
        this._callbacks = {};

        // Add loader
        this.loaders.push(this._loader);

        // Add globals
        this.addGlobal('environment', this.buildConfiguration);

        // Add filters
        if (Array.isArray(this._filters)) {
            for (const filter of this._filters) {
                if (filter instanceof Filter) {
                    filter.register(this);
                } else {
                    throw new Error('Environment was configured with invalid Filter');
                }
            }
        }

        // Add tags
        if (Array.isArray(this._tags)) {
            for (const tag of this._tags) {
                tag.register(this);
            }
        }
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [
                EntitiesRepository,
                PathesConfiguration,
                BuildConfiguration,
                'nunjucks/Environment.filters',
                'nunjucks/Environment.tags',
                'nunjucks/Environment.options'
            ],
            modes: [false, false, false, 'instance', 'instance']
        };
    }

    /**
     * The namespaced class name
     *
     * @type {string}
     * @static
     */
    static get className() {
        return 'nunjucks/Environment';
    }

    /**
     * @type {nunjucks.loader.FileLoader}
     */
    get loader() {
        return this._loader;
    }

    /**
     * @type {nunjucks.Template}
     */
    get template() {
        return this._template;
    }

    /**
     * Returns the template root pathes used for resolving templates.
     *
     * @type {Array}
     */
    get templatePaths() {
        return this._templatePaths.slice();
    }

    /**
     * @type {Array}
     */
    set templatePaths(value) {
        this._templatePaths = [];
        if (Array.isArray(value)) {
            for (const templatePath of value) {
                this._templatePaths.push(
                    waitForPromise(this.pathesConfiguration.resolve(templatePath))
                );
            }
        } else {
            this._templatePaths.push(waitForPromise(this.pathesConfiguration.resolve(value || '')));
        }
        if (this.loader) {
            this.loader.setSearchPaths(this._templatePaths);
        }
        if (this.template) {
            this.template.templatePaths = this._templatePaths;
        }
    }

    /**
     * @type {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration() {
        return this._pathesConfiguration;
    }

    /**
     * @type {model.configuration.BuildConfiguration}
     */
    get buildConfiguration() {
        return this._buildConfiguration;
    }

    /**
     * @param {String} content
     * @param {Mixed} context
     * @param {Object} options
     * @returns {String}
     */
    renderString(content, context, options) {
        const template = this._template.prepare(content, this.globals['location']);
        const result = super.renderString(template, context, options);
        return result;
    }

    /**
     * Clears all filter callbacks
     */
    clearFilterCallbacks() {
        this._callbacks = {};
    }

    /**
     * Adds a callback for a specific filter
     *
     * @param {String} name
     * @param {Function} callback
     */
    addFilterCallback(name, callback) {
        if (!this._callbacks[name]) {
            this._callbacks[name] = [];
        }
        this._callbacks[name].push(callback);
    }

    /**
     * Applies all callbacks to value for filter
     *
     * @param {nunjucks.filter.Filter} name
     * @param {Function} callback
     * @returns {Mixed}
     */
    applyFilterCallbacks(filter, value, args, data) {
        if (!this._callbacks[filter.name[0]]) {
            return value;
        }
        let result = value;
        for (const callback of this._callbacks[filter.name[0]]) {
            result = callback(filter, result, args, data);
        }
        return result;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.Environment = Environment;
