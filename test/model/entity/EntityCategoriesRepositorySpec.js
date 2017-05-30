'use strict';

/**
 * Requirements
 */
const EntityCategoriesRepository = require(ES_SOURCE + '/model/entity/EntityCategoriesRepository.js').EntityCategoriesRepository;
const repositorySpec = require(ES_TEST + '/model/RepositoryShared.js').spec;


/**
 * Spec
 */
describe(EntityCategoriesRepository.className, function()
{
    /**
     * Repository Tests
     */
    repositorySpec(EntityCategoriesRepository, 'model.entity/EntityCategoriesRepository');
});
