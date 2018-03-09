'use strict';

/**
 * Requirements
 */
const DataRepository = require(ES_SOURCE + '/model/data/DataRepository.js').DataRepository;
const dataRepositorySpec = require('./DataRepositoryShared.js').spec;


/**
 * Spec
 */
describe(DataRepository.className, function()
{
    /**
     * DataRepository Tests
     */
    dataRepositorySpec(DataRepository, 'model.data/DataRepository');
});
