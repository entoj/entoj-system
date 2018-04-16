'use strict';

/**
 * Requirements
 */
const TranslationsFilter = require(ES_SOURCE + '/nunjucks/filter/TranslationsFilter.js').TranslationsFilter;
const TranslationsRepository = require(ES_SOURCE + '/model/translation/TranslationsRepository.js').TranslationsRepository;
const TranslationsLoader = require(ES_SOURCE + '/model/translation/TranslationsLoader.js').TranslationsLoader;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;


/**
 * Spec
 */
describe(TranslationsFilter.className, function()
{
    /**
     * Filter Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic({ settings: { languages: ['en_US', 'de_DE']} });
    });
    function prepareParameters()
    {
        const loader = new TranslationsLoader(global.fixtures.sitesRepository, global.fixtures.pathesConfiguration,
            global.fixtures.globalConfiguration, ES_FIXTURES + '/model/TranslationsModel.json');
        const translationsRepository = new TranslationsRepository(loader);
        return [translationsRepository, global.fixtures.moduleConfiguration];
    }
    filterSpec(TranslationsFilter, 'nunjucks.filter/TranslationsFilter', prepareParameters);


    /**
     * TranslationsFilter Test
     */
    function createTestee(language)
    {
        const loader = new TranslationsLoader(global.fixtures.sitesRepository, global.fixtures.pathesConfiguration,
            global.fixtures.globalConfiguration, ES_FIXTURES + '/model/TranslationsModel-${language}.json');
        const translationsRepository = new TranslationsRepository(loader);
        if (language)
        {
            global.fixtures.moduleConfiguration.language = language;
        }
        return new TranslationsFilter(translationsRepository, global.fixtures.moduleConfiguration).filter();
    }

    describe('#filter()', function()
    {
        it('should return empty language objects for an empty query', function()
        {
            const testee = createTestee();
            expect(testee()).to.be.deep.equal(
                {
                    en_US: {},
                    de_DE: {}
                });
        });

        it('should return per language translations that match the query', function()
        {
            const testee = createTestee();
            expect(testee('group1')).to.be.deep.equal(
                {
                    en_US: { 'group1.value1': 'en-g1-v1', 'group1.value2': 'en-g1-v2' },
                    de_DE: { 'group1.value1': 'de-g1-v1', 'group1.value2': 'de-g1-v2' }
                });
            expect(testee('group*.value1')).to.be.deep.equal(
                {
                    en_US: { 'group1.value1': 'en-g1-v1', 'group2.value1': 'en-g2-v1' },
                    de_DE: { 'group1.value1': 'de-g1-v1', 'group2.value1': 'de-g2-v1' }
                });
        });
    });
});
