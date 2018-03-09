'use strict';

/**
 * Requirements
 */
const TranslationsLoader = require(ES_SOURCE + '/model/translation/TranslationsLoader.js').TranslationsLoader;
const MissingArgumentError = require(ES_SOURCE + '/error/MissingArgumentError.js').MissingArgumentError;
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


    describe('#constructor()', function()
    {
        it('should throw a exception when created without a proper pathesConfiguration', function()
        {
            expect(function()
            {
                new TranslationsLoader();
            }).to.throw(MissingArgumentError);

            expect(function()
            {
                new TranslationsLoader('Pathes');
            }).to.throw(TypeError);
        });
    });


    describe('#load', function()
    {
        it('should resolve to Translation instances that are loaded from one file', function()
        {
            const testee = new TranslationsLoader(global.fixtures.sitesRepository,
                global.fixtures.pathesConfiguration,
                ES_FIXTURES + '/model/TranslationsModel.json');
            const promise = co(function *()
            {
                const items = yield testee.load();
                expect(items.length).to.be.equal(2);
                expect(items.find(item => item.name === 'simple')).to.be.ok;
                expect(items.find(item => item.name === 'variables')).to.be.ok;
            });
            return promise;
        });

        it('should resolve to Translation instances that are loaded from one file per site', function()
        {
            const testee = new TranslationsLoader(global.fixtures.sitesRepository,
                global.fixtures.pathesConfiguration,
                '${sites}/${site.name.urlify()}/translations.json');
            const promise = co(function *()
            {
                const items = yield testee.load();
                expect(items.length).to.be.equal(4);
                expect(items.find(item => item.name === 'base')).to.be.ok;
                expect(items.find(item => item.name === 'base').site.name).to.be.equal('Base');
                expect(items.find(item => item.name === 'extended')).to.be.ok;
                expect(items.find(item => item.name === 'extended').site.name).to.be.equal('Extended');
            });
            return promise;
        });
    });
});
