'use strict';

/**
 * Requirements
 */
const ModelSynchronizerTranslationsPlugin = require(ES_SOURCE + '/watch/ModelSynchronizerTranslationsPlugin.js').ModelSynchronizerTranslationsPlugin;
const TranslationsRepository = require(ES_SOURCE + '/model/translation/TranslationsRepository.js').TranslationsRepository;
const TranslationsLoader = require(ES_SOURCE + '/model/translation/TranslationsLoader.js').TranslationsLoader;
const dataPluginSpec = require(ES_TEST + '/watch/ModelSynchronizerDataPluginShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');


/**
 * Spec
 */
describe(ModelSynchronizerTranslationsPlugin.className, function()
{
    /**
     * ModelSynchronizerTranslationsPlugin Test
     */
    dataPluginSpec(ModelSynchronizerTranslationsPlugin, 'watch/ModelSynchronizerTranslationsPlugin', function(parameters, fileTemplate)
    {
        const fixture = projectFixture.createDynamic();
        const dataLoader = new TranslationsLoader(fixture.sitesRepository, fixture.pathesConfiguration, fileTemplate);
        const dataRepository = new TranslationsRepository(dataLoader);
        return [fixture.cliLogger, fixture.sitesRepository, dataRepository, fixture.pathesConfiguration];
    });
});
