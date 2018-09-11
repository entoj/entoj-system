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
}


/**
 * Exports
 * @ignore
 */
module.exports.SystemModuleConfiguration = SystemModuleConfiguration;
