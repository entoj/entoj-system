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
    filterSpec(TranslateFilter, 'nunjucks.filter/TranslateFilter');


    /**
     * TranslateFilter Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
        global.fixtures.translationsRepository = new TranslationsRepository(new TranslationsLoader(global.fixtures.sitesRepository, global.fixtures.pathesConfiguration, ES_FIXTURES + '/model/TranslationsModel.json'));
    });


    describe('#filter()', function()
    {
        it('should return a empty string for a unknown translation keys', function()
        {
            const testee = new TranslateFilter(global.fixtures.translationsRepository).filter();
            expect(testee()).to.be.equal('');
            expect(testee(false, false)).to.deep.equal('');
        });

        it('should allow to translate based on the filter value', function()
        {
            const testee = new TranslateFilter(global.fixtures.translationsRepository).filter();
            expect(testee('simple')).to.be.equal('translation');
        });

        it('should allow to translate based on the filter parameter', function()
        {
            const testee = new TranslateFilter(global.fixtures.translationsRepository).filter();
            expect(testee(false, 'simple')).to.be.equal('translation');
        });

        it('should return the translation key when not found', function()
        {
            const testee = new TranslateFilter(global.fixtures.translationsRepository).filter();
            expect(testee('simple')).to.be.equal('translation');
        });

        it('should allow to use index based variables in translations', function()
        {
            const testee = new TranslateFilter(global.fixtures.translationsRepository).filter();
            expect(testee('variables', '-post', 'pre-')).to.be.equal('pre-translation-post');
        });
    });
});
