'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const Renderer = require('./Renderer.js').Renderer;
const Parser = require('./Parser.js').Parser;
const Transformer = require('./Transformer.js').Transformer;
const Configuration = require('./Configuration.js').Configuration;
const GlobalRepository = require('../model/GlobalRepository.js').GlobalRepository;
const BuildConfiguration = require('../model/configuration/BuildConfiguration.js').BuildConfiguration;
const assertParameter = require('../utils/assert.js').assertParameter;
const co = require('co');


/**
 * Source code exporter
 */
class Exporter extends Base
{
    /**
     * @ignore
     */
    constructor(globalRepository, buildConfiguration, parser, renderer, transformer)
    {
        super();

        // Check params
        assertParameter(this, 'globalRepository', globalRepository, true, GlobalRepository);
        assertParameter(this, 'buildConfiguration', buildConfiguration, true, BuildConfiguration);
        assertParameter(this, 'parser', parser, true, Parser);
        assertParameter(this, 'renderer', renderer, true, Renderer);
        assertParameter(this, 'transformer', transformer, true, Transformer);

        // Assign options
        this._globalRepository = globalRepository;
        this._buildConfiguration = buildConfiguration;
        this._parser = parser;
        this._renderer = renderer;
        this._transformer = transformer;
        this._configurationClass = Configuration;
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [GlobalRepository, BuildConfiguration, Parser, Renderer, Transformer] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'export/Exporter';
    }


    /**
     * @type {model.GlobalRepository}
     */
    get globalRepository()
    {
        return this._globalRepository;
    }


    /**
     * @type {model.configuration.BuildConfiguration}
     */
    get buildConfiguration()
    {
        return this._buildConfiguration;
    }


    /**
     * @type {export.Parser}
     */
    get parser()
    {
        return this._parser;
    }


    /**
     * @type {export.Renderer}
     */
    get renderer()
    {
        return this._renderer;
    }


    /**
     * @type {export.Transformer}
     */
    get transformer()
    {
        return this._transformer;
    }


    /**
     * @protected
     * @param {model.entity.EntityAspect} entity
     * @param {model.documentation.DocumentationCallable} macro
     * @param {Object} settings
     * @returns {Configuration}
     */
    createConfigurationInstance(entity, macro, settings)
    {
        return new this._configurationClass(entity, macro, settings,
            this.parser, this.renderer, this.transformer,
            this.globalRepository, this.buildConfiguration);
    }


    /**
     * @protected
     * @param {String} macroQuery
     * @param {String} siteQuery
     * @param {Object} settings
     * @returns {Promise<Configuration>}
     */
    createConfiguration(macroQuery, entityQuery, siteQuery, settings)
    {
        const scope = this;
        const promise = co(function *()
        {
            // Get entity
            const entity = yield scope.globalRepository.resolveEntity(siteQuery, entityQuery);
            if (!entity)
            {
                /* istanbul ignore next */
                throw new Error(scope.className + '::createContext - could not find entity for ' + entityQuery);
            }

            // Get macro
            const macro = yield scope.globalRepository.resolveMacro(siteQuery, macroQuery);
            if (!macro || !macro.file)
            {
                /* istanbul ignore next */
                scope.logger.debug('::createContext - could not find macro ' + macroQuery);
            }

            return scope.createConfigurationInstance(entity, macro, settings);
        });
        return promise;
    }


    /**
     * @returns {Promise<BaseNode>}
     */
    export(siteQuery, entityQuery, macroQuery, settings)
    {
        const scope = this;
        const promise = co(function *()
        {
            const result =
            {
                configuration: false,
                contents: ''
            };

            // Create configuration
            const configuration = yield scope.createConfiguration(macroQuery, entityQuery, siteQuery, settings);
            result.configuration = yield configuration.getExportConfiguration();

            // Parse macro
            let rootNode = false;
            if (configuration.macro)
            {
                rootNode = yield scope.parser.parseMacro(configuration.macro.name, configuration);
            }
            else
            {
                rootNode = yield scope.parser.parseTemplate(configuration.entity, configuration);
            }
            if (rootNode === false)
            {
                /* istanbul ignore next */
                throw new Error(scope.className + '::transform - could not parse macro');
            }

            // Transform parsed nodes
            const transformedRootNode = yield scope.transformer.transform(rootNode, configuration);
            if (!transformedRootNode)
            {
                /* istanbul ignore next */
                throw new Error(scope.className + ':transform - could not transform parsed node');
            }

            // Render transformed nodes
            result.contents = yield scope.renderer.render(transformedRootNode, configuration);

            //Done
            return result;
        });
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Exporter = Exporter;
