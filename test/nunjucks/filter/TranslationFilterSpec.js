'use strict';

/**
 * Requirements
 */
const TranslateFilter = require(ES_SOURCE + '/nunjucks/filter/TranslateFilter.js').TranslateFilter;
const TranslationsRepository = require(ES_SOURCE + '/model/translation/TranslationsRepository.js').TranslationsRepository;
const TranslationsLoader = require(ES_SOURCE + '/model/translation/TranslationsLoader.js').TranslationsLoader;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;


/**
 * Spec
 */
describe(TranslateFilter.className, function()
{
    /**
     * Filter Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });
    function prepareParameters()
    {
        const loader = new TranslationsLoader(global.fixtures.sitesRepository, global.fixtures.pathesConfiguration,
            global.fixtures.globalConfiguration, ES_FIXTURES + '/model/TranslationsModel.json');
        const translationsRepository = new TranslationsRepository(loader);
        return [translationsRepository, global.fixtures.moduleConfiguration];
    }
    filterSpec(TranslateFilter, 'nunjucks.filter/TranslateFilter', prepareParameters);


    /**
     * TranslateFilter Test
     */
    function createTestee(language)
    {
        global.fixtures.globalConfiguration.set('languages.list', ['en_US', 'de_DE']);
        const loader = new TranslationsLoader(global.fixtures.sitesRepository, global.fixtures.pathesConfiguration,
            global.fixtures.globalConfiguration, ES_FIXTURES + '/model/TranslationsModel-${language}.json');
        const translationsRepository = new TranslationsRepository(loader);
        if (language)
        {
            global.fixtures.moduleConfiguration.translateLanguage = language;
        }
        return new TranslateFilter(translationsRepository, global.fixtures.moduleConfiguration).filter();
    }

    describe('#filter()', function()
    {
        it('should return a empty string for a unknown translation keys', function()
        {
            const testee = createTestee();
            expect(testee()).to.be.equal('');
            expect(testee(false, false)).to.deep.equal('');
        });

        it('should allow to translate based on the filter value', function()
        {
            const testee = createTestee();
            expect(testee('simple')).to.be.equal('translation en');
        });

        it('should allow to translate based on the filter parameter', function()
        {
            const testee = createTestee();
            expect(testee(false, 'simple')).to.be.equal('translation en');
        });

        it('should use trhe configured language translations', function()
        {
            const testee = createTestee('de_DE');
            expect(testee('simple')).to.be.equal('translation de');
        });

        it('should return the translation key when not found', function()
        {
            const testee = createTestee();
            expect(testee('not found')).to.be.equal('not found');
        });

        it('should allow to use index based variables in translations', function()
        {
            const testee = createTestee();
            expect(testee('variables', '-post', 'pre-')).to.be.equal('pre-translation en-post');
        });
    });
});
