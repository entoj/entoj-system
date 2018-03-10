'use strict';

/**
 * Requirements
 */
const ModelSynchronizerDataPlugin = require(ES_SOURCE + '/watch/ModelSynchronizerDataPlugin.js').ModelSynchronizerDataPlugin;
const DataRepository = require(ES_SOURCE + '/model/data/DataRepository.js').DataRepository;
const DataLoader = require(ES_SOURCE + '/model/data/DataLoader.js').DataLoader;
const dataPluginSpec = require(ES_TEST + '/watch/ModelSynchronizerDataPluginShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');


/**
 * Spec
 */
describe(ModelSynchronizerDataPlugin.className, function()
{
    /**
     * ModelSynchronizerDataPlugin Test
     */
    dataPluginSpec(ModelSynchronizerDataPlugin, 'watch/ModelSynchronizerDataPlugin', function(parameters, fileTemplate)
    {
        const fixture = projectFixture.createDynamic();
        const dataLoader = new DataLoader(fixture.sitesRepository, fixture.pathesConfiguration, fileTemplate);
        const dataRepository = new DataRepository(dataLoader);
        return [fixture.cliLogger, fixture.sitesRepository, dataRepository, fixture.pathesConfiguration];
    });
});
