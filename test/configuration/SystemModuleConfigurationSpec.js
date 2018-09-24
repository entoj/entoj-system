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
const moduleConfigurationSpec = require(ES_TEST + '/configuration/ModuleConfigurationShared.js')
    .spec;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Spec
 */
describe(SystemModuleConfiguration.className, function() {
    /**
     * Base Test
     */
    moduleConfigurationSpec(
        SystemModuleConfiguration,
        'configuration/SystemModuleConfiguration',
        function(parameters) {
            if (parameters && parameters.length >= 2) {
                return parameters;
            }
            return [new GlobalConfiguration(), new BuildConfiguration()];
        }
    );

    /**
     * SystemModuleConfiguration Test
     */

    // create a initialized testee instance
    const createTestee = function(globalConfiguration, buildConfiguration) {
        return new SystemModuleConfiguration(
            new GlobalConfiguration(globalConfiguration),
            new BuildConfiguration({ environments: { development: buildConfiguration } })
        );
    };

    describe('Should make sure that references to other templates are resolved', function() {
        const testee = createTestee({
            system: {
                url: {
                    base: '',
                    site: '${url.base}/${site.name.urlify()}',
                    entityCategory: '${url.site}/${entityCartegory.shortName.urlify()}'
                }
            }
        });
        expect(testee.urlSite).to.be.equal('/${site.name.urlify()}');
        expect(testee.urlEntityCategory).to.be.equal(
            '/${site.name.urlify()}/${entityCartegory.shortName.urlify()}'
        );
    });

    // Simple properties
    baseSpec.assertProperty(createTestee(), ['urlBase', 'urlSite']);
});
