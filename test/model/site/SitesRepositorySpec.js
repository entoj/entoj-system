'use strict';

/**
 * Requirements
 */
const SitesRepository = require(ES_SOURCE + '/model/site/SitesRepository.js').SitesRepository;
const repositorySpec = require('../RepositoryShared.js').spec;

/**
 * Spec
 */
describe(SitesRepository.className, function() {
    /**
     * Repository Test
     */
    repositorySpec(SitesRepository, 'model.site/SitesRepository');
});
