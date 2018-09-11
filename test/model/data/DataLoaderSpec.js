'use strict';

/**
 * Requirements
 */
const DataLoader = require(ES_SOURCE + '/model/data/DataLoader.js').DataLoader;
const dataLoaderSpec = require('./DataLoaderShared.js').spec;

/**
 * Spec
 * @todo Add a way to load categories from the fs via entoj.json
 */
describe(DataLoader.className, function() {
    /**
     * DataLoader Test
     */
    dataLoaderSpec(DataLoader, 'model.data/DataLoader', function(parameters) {
        parameters.unshift(global.fixtures.pathesConfiguration);
        parameters.unshift(global.fixtures.sitesRepository);
        return parameters;
    });
});
