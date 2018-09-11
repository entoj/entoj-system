'use strict';

/**
 * Requirements
 */
const SettingsRepository = require(ES_SOURCE + '/model/setting/SettingsRepository.js')
    .SettingsRepository;
const dataRepositorySpec = require(ES_TEST + '/model/data/DataRepositoryShared.js').spec;

/**
 * Spec
 */
describe(SettingsRepository.className, function() {
    /**
     * DataRepository Tests
     */
    dataRepositorySpec(SettingsRepository, 'model.setting/SettingsRepository');
});
