'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const BuildConfiguration = require('../model/configuration/BuildConfiguration.js').BuildConfiguration;
const GlobalConfiguration = require('../model/configuration/GlobalConfiguration.js').GlobalConfiguration;
const assertParameter = require('../utils/assert.js').assertParameter;


/**
 * @memberOf configuration
 */
class SystemModuleConfiguration extends Base
{
    /**
     * @param {model.configuration.GlobalConfiguration} globalConfiguration
     * @param {model.configuration.BuildConfiguration} buildConfiguration
     * @param {Object} options
     */
    constructor(globalConfiguration, buildConfiguration, options)
    {
        super();

        //Check params
        assertParameter(this, 'globalConfiguration', globalConfiguration, true, GlobalConfiguration);
        assertParameter(this, 'buildConfiguration', buildConfiguration, true, BuildConfiguration);

        // Create configuration
        this._language = buildConfiguration.get('language', globalConfiguration.get('language', 'en_US'));
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [GlobalConfiguration, BuildConfiguration, 'configuration/SystemModuleConfiguration.options'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'configuration/SystemModuleConfiguration';
    }


    /**
     * @type {String}
     */
    get language()
    {
        return this._language;
    }

    set language(value)
    {
        this._language = value;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.SystemModuleConfiguration = SystemModuleConfiguration;
