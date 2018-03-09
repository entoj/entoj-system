'use strict';

/**
 * Requirements
 */
const TranslationsRepository = require(ES_SOURCE + '/model/translation/TranslationsRepository.js').TranslationsRepository;
const dataRepositorySpec = require(ES_TEST + '/model/data/DataRepositoryShared.js').spec;


/**
 * Spec
 */
describe(TranslationsRepository.className, function()
{
    /**
     * DataRepository Tests
     */
    dataRepositorySpec(TranslationsRepository, 'model.translation/TranslationsRepository');
});
