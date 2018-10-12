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

    // Path properties
    baseSpec.assertProperty(createTestee(), [
        'pathBase',
        'pathEntoj',
        'pathData',
        'pathCache',
        'pathSites',
        'pathSite',
        'pathEntityCategory',
        'pathEntityId'
    ]);
    baseSpec.assertProperty(createTestee(), [
        'urlBase',
        'urlSite',
        'urlEntityCategory',
        'urlEntityId'
    ]);
    baseSpec.assertProperty(createTestee(), [
        'routeBase',
        'routeSite',
        'routeEntityCategory',
        'routeEntityId'
    ]);
    baseSpec.assertProperty(createTestee(), [
        'serverHttp2',
        'serverPort',
        'serverSslCert',
        'serverSslKey',
        'serverAuthentication',
        'serverUsername',
        'serverPassword',
        'serverAllowedStaticExtensions'
    ]);
    baseSpec.assertProperty(createTestee(), [
        'filterAssetUrlBaseUrl',
        'filterSvgUrlBaseUrl',
        'filterSvgViewBoxBasePath',
        'filterLinkUrlProperties',
        'filterMarkupStyles'
    ]);
});
