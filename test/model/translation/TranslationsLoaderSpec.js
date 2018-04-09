'use strict';

/**
 * Requirements
 */
const TranslationsLoader = require(ES_SOURCE + '/model/translation/TranslationsLoader.js').TranslationsLoader;
const dataLoaderSpec = require('../data/DataLoaderShared.js').spec;
const co = require('co');


/**
 * Spec
 */
describe(TranslationsLoader.className, function()
{
    /**
     * DataLoader Test
     */
    function prepareParameters(parameters)
    {
        parameters.unshift(global.fixtures.globalConfiguration);
        parameters.unshift(global.fixtures.pathesConfiguration);
        parameters.unshift(global.fixtures.sitesRepository);
        return parameters;
    }
    dataLoaderSpec(TranslationsLoader, 'model.translation/TranslationsLoader', prepareParameters);


    /**
     * TranslationsLoader Test
     */
    const createTestee = function()
    {
        let parameters = Array.from(arguments);
        if (prepareParameters)
        {
            parameters = prepareParameters(parameters);
        }
        return new TranslationsLoader(...parameters);
    };

    describe('#load', function()
    {
        it('should resolve to Translation instances for each loaded language file', function()
        {
            global.fixtures.globalConfiguration.set('languages', ['en_US', 'de_DE']);
            const testee = createTestee(ES_FIXTURES + '/model/TranslationsModel-${language}.json');
            const promise = co(function *()
            {
                const items = yield testee.load();
                expect(items.length).to.be.equal(2);
                expect(items.find(item => item.language === 'en_US')).to.be.ok;
                expect(items.find(item => item.language === 'de_DE')).to.be.ok;
            });
            return promise;
        });
    });
});
