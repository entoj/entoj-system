'use strict';

// Requirements
const Base = require('../Base.js').Base;
const GlobalRepository = require('../model/GlobalRepository.js').GlobalRepository;
const BuildConfiguration = require('../model/configuration/BuildConfiguration.js').BuildConfiguration;
const DocumentationCallable = require('../model/documentation/DocumentationCallable.js').DocumentationCallable;
const EntityAspect = require('../model/entity/EntityAspect.js').EntityAspect;
const Parser = require('./Parser.js').Parser;
const Renderer = require('./Renderer.js').Renderer;
const Transformer = require('./Transformer.js').Transformer;
const assertParameter = require('../utils/assert.js').assertParameter;
const co = require('co');
const merge = require('lodash.merge');
const omit = require('lodash.omit');
const minimatch = require('minimatch');


/**
 * The configuration holds all macro specific settings needed
 * for exporting.
 *
 * @memberOf export
 * @extends Base
 */
class Configuration extends Base
{
    /**
     * @ignore
     */
    constructor(entity, macro, settings, parser, renderer, transformer, globalRepository, buildConfiguration)
    {
        super();

        // Check params
        assertParameter(this, 'entity', entity, false, EntityAspect);
        assertParameter(this, 'macro', macro, false, DocumentationCallable);
        assertParameter(this, 'parser', parser, false, Parser);
        assertParameter(this, 'renderer', renderer, false, Renderer);
        assertParameter(this, 'transformer', transformer, false, Transformer);
        assertParameter(this, 'globalRepository', globalRepository, true, GlobalRepository);
        assertParameter(this, 'buildConfiguration', buildConfiguration, true, BuildConfiguration);

        // Assign options
        this._macro = macro;
        this._entity = entity;
        this._settings = settings || {};
        this._parser = parser;
        this._renderer = renderer;
        this._transformer = transformer;
        this._globalRepository = globalRepository;
        this._buildConfiguration = buildConfiguration;
        this._identifier = 'default';
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export/Configuration';
    }


    /**
     * @type {model.configuration.BuildConfiguration}
     */
    get buildConfiguration()
    {
        return this._buildConfiguration;
    }


    /**
     * The configuration identifier used to extract
     * settings from entity configurations.
     *
     * @type {String}
     */
    get identifier()
    {
        return this._identifier;
    }


    /**
     * The macro this context was created for.
     * Maybe empty.
     *
     * @type {DocumentationCallable}
     */
    get macro()
    {
        return this._macro;
    }


    /**
     * The entity this context was created for.
     *
     * @type {Entity}
     */
    get entity()
    {
        return this._entity;
    }


    /**
     * The site this context was created for.
     * Maybe empty.
     *
     * @type {Site}
     */
    get site()
    {
        return this._entity ? this._entity.site : undefined;
    }


    /**
     * The settings for this specific export.
     *
     * @type {Object}
     */
    get settings()
    {
        return this._settings;
    }


    /**
     * Access to the parser instance.
     *
     * @type {export.Parser}
     */
    get parser()
    {
        return this._parser;
    }


    /**
     * Access to the renderer instance.
     *
     * @type {export.Renderer}
     */
    get renderer()
    {
        return this._renderer;
    }


    /**
     * Access to the transformer instance.
     *
     * @type {export.Transformer}
     */
    get transformer()
    {
        return this._transformer;
    }


    /**
     * The default configurations used as a base
     * for specific macro configurations.
     *
     * @protected
     * @param {Object} configuration
     * @returns {Promise<Object>}
     */
    getDefaultMacroConfiguration(configuration)
    {
        return Promise.resolve({});
    }


    /**
     * Template method to allow subclasses to make last minute changes to
     * configurations.
     *
     * @protected
     * @param {Object} configuration
     * @returns {Promise<Object>}
     */
    refineMacroConfiguration(configuration)
    {
        return Promise.resolve(configuration);
    }


    /**
     * Creates a macro specific configuration based
     * on the default, the entity configuration and the refined.
     *
     * @param {String} [macroQuery]
     * @returns {Promise<Object>}
     */
    getMacroConfiguration(macroQuery)
    {
        const scope = this;
        const promise = co(function *()
        {
            let macro;

            // Default is the main macro
            if (!macroQuery)
            {
                macroQuery = scope.macro;
            }

            // Get Macro
            if (macroQuery instanceof DocumentationCallable)
            {
                macro = macroQuery;
            }
            else
            {
                macro = yield scope._globalRepository.resolveMacro(scope.site, macroQuery);
            }
            if (!macro || !(macro instanceof DocumentationCallable))
            {
                /* istanbul ignore next */
                scope.logger.warn('getMacroConfiguration - could not find macro ' + macroQuery);
                return false;
            }

            // Get Entity
            const entity = yield scope._globalRepository.resolveEntityForMacro(scope.site, macro);
            if (!entity)
            {
                /* istanbul ignore next */
                scope.logger.warn('getMacroConfiguration - could not find entity for macro ' + macroQuery);
                return false;
            }

            // Basic configuration
            const basics = {};
            basics.macro = macro;
            basics.entity = entity;
            basics.site = entity.id.site;
            basics.filename = entity.pathString;
            basics.mode = 'default';

            // Extend
            const configurations = [];
            configurations.push(basics);

            // Add defaults
            configurations.push(yield scope.getDefaultMacroConfiguration(basics));

            // Add global macro settings
            configurations.push(omit(basics.entity.properties.getByPath('export.settings.' + scope.identifier, {}), ['macros']));
            const globalMacros = basics.entity.properties.getByPath('export.settings.' + scope.identifier + '.macros', {});
            for (const match in globalMacros)
            {
                if (minimatch(basics.macro.name, match))
                {
                    configurations.push(globalMacros[match]);
                }
            }

            // Add local macro export settings
            const localMacros = scope.settings.settings && scope.settings.settings.macros
                ? scope.settings.settings.macros
                : {};

            for (const match in localMacros)
            {
                if (minimatch(basics.macro.name, match))
                {
                    configurations.push(localMacros[match]);
                }
            }

            // Add local export settings
            if (!scope.macro || scope.macro.name === macro.name)
            {
                configurations.push(omit(scope.settings, ['macros', 'macro']));
            }

            // Merge
            const configuration = merge(...configurations);

            // Refine
            const result = yield scope.refineMacroConfiguration(configuration);

            // Okay
            return result;
        });
        return promise;
    }
}


// Exports
module.exports.Configuration = Configuration;
