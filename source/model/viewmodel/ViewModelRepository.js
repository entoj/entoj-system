'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;
const ViewModel = require('./ViewModel.js').ViewModel;
const ErrorHandler = require('../../error/ErrorHandler.js').ErrorHandler;
const EntitiesRepository = require('../entity/EntitiesRepository.js').EntitiesRepository;
const PathesConfiguration = require('../configuration/PathesConfiguration.js').PathesConfiguration;
const assertParameter = require('../../utils/assert.js').assertParameter;
const co = require('co');
const fs = require('co-fs-extra');
const path = require('path');
const isObject = require('lodash.isobject');
const isString = require('lodash.isstring');


/**
 * @class
 * @memberOf model.viewmodel
 * @extends {Base}
 */
class ViewModelRepository extends Base
{
    /**
     * @param {model.entity.EntitiesRepository} entitiesRepository
     */
    constructor(entitiesRepository, pathesConfiguration, plugins)
    {
        super();

        // Check params
        assertParameter(this, 'entitiesRepository', entitiesRepository, true, EntitiesRepository);
        assertParameter(this, 'pathesConfiguration', pathesConfiguration, true, PathesConfiguration);

        // Assign
        this._entitiesRepository = entitiesRepository;
        this._pathesConfiguration = pathesConfiguration;
        this._plugins = plugins || [];
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [EntitiesRepository, PathesConfiguration, 'model.viewmodel/ViewModelRepository.plugins'] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model.viewmodel/ViewModelRepository';
    }


    /**
     * @type {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration()
    {
        return this._pathesConfiguration;
    }


    /**
     * @type {Array}
     */
    get plugins()
    {
        return this._plugins;
    }


    /**
     * Recursively scan data for macro calls (@macro:options)
     * and hand them over to ViewModelPlugins
     *
     * @protected
     * @param {*} data
     * @param {mode.site.Site} site
     * @param {Boolean} useStaticContent - Should we use static or random contents?
     * @param {Object} options
     */
    process(data, site, useStaticContent, options)
    {
        const scope = this;
        const promise = co(function*()
        {
            // Handle arrays
            if (Array.isArray(data))
            {
                const result = [];
                for (const item of data)
                {
                    const value = yield scope.process(item, site, useStaticContent, options);
                    result.push(value);
                }
                return result;
            }

            // Handle object literals
            if (isObject(data))
            {
                const keys = Object.keys(data);
                const result = {};
                for (const key of keys)
                {
                    const value = yield scope.process(data[key], site, useStaticContent, options);
                    result[key] = value;
                }
                return result;
            }

            // Handle plugins
            if (isString(data))
            {
                //Is it a plugin call?
                const macro = data.match(/^@([\w-]+):(.*)$/i);
                if (macro)
                {
                    const name = macro[1].toLowerCase();
                    const parameters = macro[2] || '';
                    for (const plugin of scope._plugins)
                    {
                        const result = yield plugin.execute(scope, site, useStaticContent, name, parameters, options);
                        if (typeof result !== 'undefined')
                        {
                            return result;
                        }
                    }
                }
            }

            // Everything else
            return data;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }


    /**
     * Resolves to a Object
     *
     * @protected
     * @param {String} filename - The filesystem path to a model json
     * @param {model.site.Site} site - The site context
     * @param {Boolean} useStaticContent - Should we use static or random contents?
     * @param {Object} options
     */
    loadFile(filename, site, useStaticContent, options)
    {
        const scope = this;
        const promise = co(function*()
        {
            const fileContents = yield fs.readFile(filename, { encoding: 'utf8' });
            const rawData = JSON.parse(fileContents);
            const data = yield scope.process(rawData, site, useStaticContent, options);
            return data;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }


    /**
     * Transforms the given path to a actual path on
     * the filesystem and hands that over to loadFile
     *
     * @protected
     * @param {String} pth - The model path in the form of entity/modelName
     * @param {model.site.Site} site - The site context
     * @param {Boolean} useStaticContent - Should we use static or random contents?
     * @param {Object} options
     */
    load(pth, site, useStaticContent, options)
    {
        const scope = this;
        const promise = co(function*()
        {
            // Check straight path
            let filename = path.join(scope._pathesConfiguration.sites, pth);
            if (!filename.endsWith('.json'))
            {
                filename+= '.json';
            }
            const fileExists = yield fs.exists(filename);
            if (fileExists)
            {
                const model = yield scope.loadFile(filename, site, useStaticContent, options);
                return model;
            }

            // Check entity short form (entityId:modelName)
            const pathParts = pth.split('/');
            const entityId = pathParts[0] || '';
            const modelName = pathParts[1] || '';
            const entity = yield scope._entitiesRepository.getById(entityId, site);
            if (entity)
            {
                // Build a model path
                let modelPath = '/models/' + modelName;
                if (!modelPath.endsWith('.json'))
                {
                    modelPath+= '.json';
                }
                filename = yield scope._pathesConfiguration.resolveEntity(entity, modelPath);
                const fileExists = yield fs.exists(filename);
                if (fileExists)
                {
                    const model = yield scope.loadFile(filename, site, useStaticContent, options);
                    return model;
                }

                // Check extended parent
                if (entity.site && entity.site.extends)
                {
                    const parentEntity = yield scope._entitiesRepository.getById(entityId, entity.site.extends);
                    filename = yield scope._pathesConfiguration.resolveEntity(parentEntity, modelPath);
                    const fileExists = yield fs.exists(filename);
                    if (fileExists)
                    {
                        const model = yield scope.loadFile(filename, site, useStaticContent, options);
                        return model;
                    }
                }
            }
            else
            {
                scope.logger.warn('load(' + pth + ') : Entity not found', entityId);
            }

            return false;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }


    /**
     * Resolves to a ViewModel
     *
     * @param {String} path - The model path in the form of entity/modelName
     * @param {model.site.Site} site - The site context
     * @param {Boolean} useStaticContent - Should we use static or random contents?
     * @param {Object} options
     * @returns {Promise<ViewModel>}
     */
    getByPath(path, site, useStaticContent, options)
    {
        if (!path)
        {
            return Promise.resolve(false);
        }
        const scope = this;
        const promise = co(function*()
        {
            const data = yield scope.load(path, site, useStaticContent, options);
            return new ViewModel({ data: data });
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ViewModelRepository = ViewModelRepository;
