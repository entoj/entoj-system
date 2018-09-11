'use strict';

/**
 * Requirements
 */
const SystemModuleConfiguration = require(ES_SOURCE + '/configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Spec
 */
describe(SystemModuleConfiguration.className, function() {
    /**
     * Base Test
     */
    baseSpec(SystemModuleConfiguration, 'configuration/SystemModuleConfiguration', function(
        parameters
    ) {
        return [new GlobalConfiguration(), new BuildConfiguration()];
    });

    /**
     * SystemModuleConfiguration Test
     */

    // create a initialized testee instance
    /*
    const createTestee = function(globalConfiguration, buildConfiguration)
    {
        return new SystemModuleConfiguration(new GlobalConfiguration(globalConfiguration),
            new BuildConfiguration({ environments : { development: buildConfiguration }}));
    };
    */

    // Simple properties
    /*
    baseSpec.assertProperty(createTestee(), ['languages'], undefined, ['en_US']);
    baseSpec.assertProperty(createTestee(), ['language'], 'de_DE', 'en_US');

    describe('Configuration via GlobalConfiguration', function()
    {
        baseSpec.assertProperty(createTestee({ languages: ['de_DE'] }), ['languages'], undefined, ['de_DE']);
        baseSpec.assertProperty(createTestee({ language: 'de_DE' }), ['language'], 'en_US', 'de_DE');
    });

    describe('Configuration via BuildConfiguration', function()
    {
        baseSpec.assertProperty(createTestee(undefined, { languages: ['de_DE'] }), ['languages'], undefined, ['de_DE']);
        baseSpec.assertProperty(createTestee(undefined, { language: 'de_DE' }), ['language'], 'en_GB', 'de_DE');
    });
    */
});
