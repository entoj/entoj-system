'use strict';

/**
 * Requirements
 */
const ModelSynchronizerTranslationsPlugin = require(ES_SOURCE + '/watch/ModelSynchronizerTranslationsPlugin.js').ModelSynchronizerTranslationsPlugin;
const TranslationsRepository = require(ES_SOURCE + '/model/translation/TranslationsRepository.js').TranslationsRepository;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');
const sinon = require('sinon');


/**
 * Spec
 */
describe(ModelSynchronizerTranslationsPlugin.className, function()
{
    /**
     * Base Test
     */
    baseSpec(ModelSynchronizerTranslationsPlugin, 'watch/ModelSynchronizerTranslationsPlugin', function(parameters)
    {
        global.fixtures.translationsRepository = global.fixtures.context.di.create(TranslationsRepository);
        return [global.fixtures.cliLogger, global.fixtures.sitesRepository, global.fixtures.translationsRepository,
            global.fixtures.pathesConfiguration];
    });


    /**
     * ModelSynchronizerTranslationsPlugin Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createDynamic();
        global.fixtures.translationsRepository = global.fixtures.context.di.create(TranslationsRepository);
    });

    const createTestee = function()
    {
        return new ModelSynchronizerTranslationsPlugin(global.fixtures.cliLogger, global.fixtures.sitesRepository,
            global.fixtures.translationsRepository, global.fixtures.pathesConfiguration);
    };


    describe('#processChanges', function()
    {
        it('should invalidate ....', function()
        {
            const promise = co(function *()
            {
                const testee = createTestee();
                const input =
                {
                    files: ['/base/translations.json']
                };
                yield testee.execute(input);
            });
            return promise;
        });
    });
});
