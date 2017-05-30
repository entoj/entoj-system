'use strict';

/**
 * Requirements
 */
const SitesLoader = require(ES_SOURCE + '/model/site/SitesLoader.js').SitesLoader;
const PackagePlugin = require(ES_SOURCE + '/model/loader/documentation/PackagePlugin.js').PackagePlugin;
const MissingArgumentError = require(ES_SOURCE + '/error/MissingArgumentError.js').MissingArgumentError;
const loaderSpec = require('../LoaderShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');


/**
 * Spec
 */
describe(SitesLoader.className, function()
{
    /**
     * Loader Test
     */
    loaderSpec(SitesLoader, 'model.site/SitesLoader', function(parameters)
    {
        parameters.unshift(global.fixtures.pathesConfiguration);
        return parameters;
    });


    /**
     * SitesLoader Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });


    describe('#constructor()', function()
    {
        it('should throw a exception when created without a proper pathesConfiguration', function()
        {
            expect(function()
            {
                new SitesLoader();
            }).to.throw(MissingArgumentError);

            expect(function()
            {
                new SitesLoader('Pathes');
            }).to.throw(TypeError);
        });
    });


    describe('#load', function()
    {
        it('should resolve to Site instances extracted from the given directory structure', function()
        {
            const testee = new SitesLoader(global.fixtures.pathesConfiguration);
            const promise = co(function *()
            {
                const items = yield testee.load();
                expect(items.length).to.be.equal(2);
                expect(items[0].name).to.be.equal('Base');
                expect(items[1].name).to.be.equal('Extended');
            });
            return promise;
        });

        it('should allow to extend a Site via the extends property in package.json', function()
        {
            const testee = new SitesLoader(global.fixtures.pathesConfiguration, [new PackagePlugin(global.fixtures.pathesConfiguration)]);
            const promise = co(function *()
            {
                const items = yield testee.load();
                expect(items.length).to.be.equal(2);
                expect(items[0].name).to.be.equal('Base');
                expect(items[1].name).to.be.equal('Extended');
                expect(items[1].extends).to.be.equal(items[0]);
            });
            return promise;
        });
    });
});
