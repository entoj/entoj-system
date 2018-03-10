'use strict';

/**
 * Requirements
 */
const SettingsLoader = require(ES_SOURCE + '/model/setting/SettingsLoader.js').SettingsLoader;
const dataLoaderSpec = require('../data/DataLoaderShared.js').spec;


/**
 * Spec
 */
describe(SettingsLoader.className, function()
{
    /**
     * DataLoader Test
     */
    dataLoaderSpec(SettingsLoader, 'model.setting/SettingsLoader', function(parameters)
    {
        parameters.unshift(global.fixtures.pathesConfiguration);
        parameters.unshift(global.fixtures.sitesRepository);
        return parameters;
    });
});
