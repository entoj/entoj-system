'use strict';

/**
 * Requirements
 */
const TranslationsLoader = require(ES_SOURCE + '/model/translation/TranslationsLoader.js').TranslationsLoader;
const loaderSpec = require('../LoaderShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');


/**
 * Spec
 * @todo Add a way to load categories from the fs via entoj.json
 */
describe(TranslationsLoader.className, function()
{
    /**
     * Loader Test
     */
    loaderSpec(TranslationsLoader, 'model.translation/TranslationsLoader', function(parameters)
    {
        parameters.unshift(global.fixtures.pathesConfiguration);
        parameters.unshift(global.fixtures.sitesRepository);
        return parameters;
    });


    /**
     * TranslationsLoader Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createDynamic();
    });


    describe('#load', function()
    {
        it('should resolve to a Translation instances for the loaded file', function()
        {
            const testee = new TranslationsLoader(global.fixtures.sitesRepository,
                global.fixtures.pathesConfiguration,
                ES_FIXTURES + '/model/TranslationsModel.json');
            const promise = co(function *()
            {
                const items = yield testee.load();
                expect(items.length).to.be.equal(1);
                expect(items.find(item => item.site.name === 'Base')).to.be.ok;
            });
            return promise;
        });

        it('should resolve to Translation instances foreach loaded file', function()
        {
            const testee = new TranslationsLoader(global.fixtures.sitesRepository,
                global.fixtures.pathesConfiguration,
                '${sites}/${site.name.urlify()}/translations.json');
            const promise = co(function *()
            {
                const items = yield testee.load();
                expect(items.length).to.be.equal(2);
                expect(items.find(item => item.site.name === 'Base')).to.be.ok;
                expect(items.find(item => item.site.name === 'Extended')).to.be.ok;
            });
            return promise;
        });
    });
});
