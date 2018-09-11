'use strict';

/**
 * Requirements
 */
const ModuleConfiguration = require(ES_SOURCE + '/configuration/ModuleConfiguration.js')
    .ModuleConfiguration;
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const moduleConfigurationSpec = require('./ModuleConfigurationShared.js').spec;

/**
 * Spec
 */
describe(ModuleConfiguration.className, function() {
    /**
     * Configuration Test
     */
    function prepareParameters(parameters) {
        if (parameters && parameters.length >= 2) {
            return parameters;
        }
        return [new GlobalConfiguration(), new BuildConfiguration()];
    }

    moduleConfigurationSpec(
        ModuleConfiguration,
        'configuration/ModuleConfiguration',
        prepareParameters
    );
});
