'use strict';

/**
 * Requirements
 */
const ModelSynchronizerSettingsPlugin = require(ES_SOURCE +
    '/watch/ModelSynchronizerSettingsPlugin.js').ModelSynchronizerSettingsPlugin;
const SettingsRepository = require(ES_SOURCE + '/model/setting/SettingsRepository.js')
    .SettingsRepository;
const SettingsLoader = require(ES_SOURCE + '/model/setting/SettingsLoader.js').SettingsLoader;
const dataPluginSpec = require(ES_TEST + '/watch/ModelSynchronizerDataPluginShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');

/**
 * Spec
 */
describe(ModelSynchronizerSettingsPlugin.className, function() {
    /**
     * ModelSynchronizerSettingsPlugin Test
     */
    dataPluginSpec(
        ModelSynchronizerSettingsPlugin,
        'watch/ModelSynchronizerSettingsPlugin',
        function(parameters, fileTemplate) {
            const fixture = projectFixture.createDynamic();
            fixture.moduleConfiguration.configuration.set('filenameSettings', fileTemplate);
            const dataLoader = new SettingsLoader(
                fixture.sitesRepository,
                fixture.pathesConfiguration,
                fixture.moduleConfiguration
            );
            const dataRepository = new SettingsRepository(dataLoader);
            return [
                fixture.cliLogger,
                fixture.sitesRepository,
                dataRepository,
                fixture.pathesConfiguration
            ];
        }
    );
});
