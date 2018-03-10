'use strict';

/**
 * Requirements
 */
const TranslationsLoader = require(ES_SOURCE + '/model/translation/TranslationsLoader.js').TranslationsLoader;
const dataLoaderSpec = require('../data/DataLoaderShared.js').spec;


/**
 * Spec
 */
describe(TranslationsLoader.className, function()
{
    /**
     * DataLoader Test
     */
    dataLoaderSpec(TranslationsLoader, 'model.translation/TranslationsLoader', function(parameters)
    {
        parameters.unshift(global.fixtures.pathesConfiguration);
        parameters.unshift(global.fixtures.sitesRepository);
        return parameters;
    });
});
