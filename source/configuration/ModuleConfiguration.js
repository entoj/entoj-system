'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const BuildConfiguration = require('../model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const GlobalConfiguration = require('../model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const assertParameter = require('../utils/assert.js').assertParameter;

/**
 * @memberOf configuration
 */
class ModuleConfiguration extends Base {
    /**
     * @param {model.configuration.GlobalConfiguration} globalConfiguration
     * @param {model.configuration.BuildConfiguration} buildConfiguration
     */
    constructor(globalConfiguration, buildConfiguration) {
        super();

        //Check params
        assertParameter(
            this,
            'globalConfiguration',
            globalConfiguration,
            true,
            GlobalConfiguration
        );
        assertParameter(this, 'buildConfiguration', buildConfiguration, true, BuildConfiguration);

        // Set
        this._globalConfiguration = globalConfiguration;
        this._buildConfiguration = buildConfiguration;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [GlobalConfiguration, BuildConfiguration]
        };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'configuration/ModuleConfiguration';
    }

    /**
     * @type {model.configuration.GlobalConfiguration}
     */
    get globalConfiguration() {
        return this._globalConfiguration;
    }

    /**
     * @type {model.configuration.BuildConfiguration}
     */
    get buildConfiguration() {
        return this._buildConfiguration;
    }

    /**
     * @param {String} path
     * @param {mixed} defaultValue
     */
    getConfiguration(path, defaultValue) {
        return this.buildConfiguration.get(path, this.globalConfiguration.get(path, defaultValue));
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ModuleConfiguration = ModuleConfiguration;
