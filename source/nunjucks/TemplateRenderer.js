'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const UrlsConfiguration = require('../model/configuration/UrlsConfiguration.js').UrlsConfiguration;
const Environment = require('./Environment.js').Environment;
const PathesConfiguration = require('../model/configuration/PathesConfiguration.js')
    .PathesConfiguration;
const assertParameter = require('../utils/assert.js').assertParameter;
const synchronize = require('../utils/synchronize.js').synchronize;
const kebabCase = require('lodash.kebabcase');
const camelCase = require('lodash.camelcase');

/**
 * @memberOf nunjucks
 */
class TemplateRenderer extends Base {
    /**
     * @param {model.configuration.UrlsConfiguration} urlsConfiguration
     * @param {model.configuration.PathesConfiguration} pathesConfiguration
     * @param {nunjucks.Environment} nunjucks
     * @param {Object} options
     */
    constructor(urlsConfiguration, pathesConfiguration, nunjucks, templatePaths, models, types) {
        super();

        // Check params
        assertParameter(this, 'urlsConfiguration', urlsConfiguration, true, UrlsConfiguration);
        assertParameter(
            this,
            'pathesConfiguration',
            pathesConfiguration,
            true,
            PathesConfiguration
        );
        assertParameter(this, 'nunjucks', nunjucks, true, Environment);

        // Assign options
        this._pathesConfiguration = pathesConfiguration;
        this._urlsConfiguration = urlsConfiguration;
        this._nunjucks = nunjucks;
        this._models = {};
        this._types = {};

        // Add models
        if (Array.isArray(models)) {
            for (const model of models) {
                // Generate a suitable name
                const nameParts = kebabCase(model.className.split('/').pop()).split('-');
                nameParts.pop();
                const name = camelCase(nameParts.join('-'));
                this._models[name] = synchronize(model);
            }
        }

        // Add types
        if (Array.isArray(types)) {
            for (const type of types) {
                // Generate a suitable name
                const name = type.className.split('/').pop();
                // Generate a plain object from the static type class
                // This is needed because nunjucks can't handle static getters
                this._types[name] = {};
                const constants = Object.getOwnPropertyNames(type);
                for (const constant of constants) {
                    if (constant == constant.toUpperCase()) {
                        this._types[name][constant] = type[constant];
                    }
                }
            }
        }

        // Add template pathes
        this.addTemplatePath(templatePaths || pathesConfiguration.sites);
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [
                UrlsConfiguration,
                PathesConfiguration,
                Environment,
                'nunjucks/TemplateRenderer.templatePaths',
                'nunjucks/TemplateRenderer.models',
                'nunjucks/TemplateRenderer.types'
            ],
            modes: [false, false, false, false, 'instance']
        };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'nunjucks/TemplateRenderer';
    }

    /**
     * @type {Array}
     */
    get templatePaths() {
        return this.nunjucks.templatePaths;
    }

    /**
     * Adds the given pathes to templatePaths
     */
    addTemplatePath(...templatePaths) {
        this.nunjucks.addTemplatePath(...templatePaths);
    }

    /**
     * @type {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration() {
        return this._pathesConfiguration;
    }

    /**
     * @type {model.configuration.UrlsConfiguration}
     */
    get urlsConfiguration() {
        return this._urlsConfiguration;
    }

    /**
     * @type {nunjucks.Environment}
     */
    get nunjucks() {
        return this._nunjucks;
    }

    /**
     * @param {String} content
     * @param {String} filename
     * @param {Object} data
     * @param {Object} valueObjects
     * @param {Object} request
     * @returns Promise<String>
     */
    render(content, filename, data, valueObjects, request) {
        // Prepare location
        const location = {
            request: request || {},
            url: request ? request.url : '',
            site: valueObjects ? valueObjects.site : false,
            entityCategory: valueObjects ? valueObjects.entityCategory : false,
            entity: valueObjects ? valueObjects.entity : false
        };
        if (!location.site && valueObjects && valueObjects.entity && valueObjects.entity.id.site) {
            location.site = valueObjects.entity.id.site;
        }
        if (
            !location.entityCategory &&
            valueObjects &&
            valueObjects.entity &&
            valueObjects.entity.id.category
        ) {
            location.entityCategory = valueObjects.entity.id.category;
        }

        // Add globals
        this.nunjucks.addGlobal('global', { foo: 'bar' });
        this.nunjucks.addGlobal('entoj', {
            location: location,
            type: this._types,
            model: this._models
        });

        // Render
        return Promise.resolve(this.nunjucks.renderString(content, data, { path: filename }));
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.TemplateRenderer = TemplateRenderer;
