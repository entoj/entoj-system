'use strict';

/**
 * Requirements
 */
const SettingsRepository = require(ES_SOURCE + '/model/setting/SettingsRepository.js').SettingsRepository;
const repositorySpec = require(ES_TEST + '/model/RepositoryShared.js').spec;


/**
 * Spec
 */
describe(SettingsRepository.className, function()
{
    /**
     * Repository Tests
     */
    repositorySpec(SettingsRepository, 'model.setting/SettingsRepository');
});
