'use strict';

/**
 * Requirements
 */
const TranslationsRepository = require(ES_SOURCE + '/model/Translation/TranslationsRepository.js').TranslationsRepository;
const repositorySpec = require(ES_TEST + '/model/RepositoryShared.js').spec;


/**
 * Spec
 */
describe(TranslationsRepository.className, function()
{
    /**
     * Repository Tests
     */
    repositorySpec(TranslationsRepository, 'model.translation/TranslationsRepository');
});
