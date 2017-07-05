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
        return { 'parameters': [GlobalRepository, Parser, Renderer, Transformer] };
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
     * @param {String} macroQuery
     * @param {String} siteQuery
     * @param {Object} settings
     * @returns {Promise<Configuration>}
     */
    createConfiguration(macroQuery, siteQuery, settings)
    {
        const scope = this;
        const promise = co(function *()
        {
            // Get macro
            const macro = yield scope.globalRepository.resolveMacro(siteQuery, macroQuery);
            if (!macro || !macro.file)
            {
                /* istanbul ignore next */
                throw new Error(scope.className + '::createContext - could not find macro ' + macroQuery);
            }

            // Get entity
            const entity = yield scope.globalRepository.resolveEntityForMacro(siteQuery, macroQuery);
            if (!entity)
            {
                /* istanbul ignore next */
                throw new Error(scope.className + '::createContext - could not find entity for ' + macroQuery);
            }

            return new scope._configurationClass(entity, macro, settings, scope.parser, scope.renderer, scope.transformer, scope.globalRepository, scope.buildConfiguration);
        });
        return promise;
    }


    /**
     * @returns {Promise<BaseNode>}
     */
    export(siteQuery, macroQuery, settings)
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
            const configuration = yield scope.createConfiguration(macroQuery, siteQuery, settings);
            result.configuration = yield configuration.getMacroConfiguration();

            // Parse macro
            const rootNode = yield scope.parser.parseMacro(configuration.macro.name, configuration);
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
