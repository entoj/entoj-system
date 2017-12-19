'use strict';

/**
 * Requirements
 */
const SettingsLoader = require(ES_SOURCE + '/model/setting/SettingsLoader.js').SettingsLoader;
const MissingArgumentError = require(ES_SOURCE + '/error/MissingArgumentError.js').MissingArgumentError;
const loaderSpec = require('../LoaderShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');


/**
 * Spec
 * @todo Add a way to load categories from the fs via entoj.json
 */
describe(SettingsLoader.className, function()
{
    /**
     * Loader Test
     */
    loaderSpec(SettingsLoader, 'model.setting/SettingsLoader', function(parameters)
    {
        parameters.unshift(global.fixtures.pathesConfiguration);
        return parameters;
    });


    /**
     * SettingsLoader Test
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
                new SettingsLoader();
            }).to.throw(MissingArgumentError);

            expect(function()
            {
                new SettingsLoader('Pathes');
            }).to.throw(TypeError);
        });
    });


    describe('#load', function()
    {
        it('should resolve to Setting instances that are loaded from a file', function()
        {
            const testee = new SettingsLoader(global.fixtures.pathesConfiguration, ES_FIXTURES + '/model/SettingsModel.json');
            const promise = co(function *()
            {
                const items = yield testee.load();
                expect(items.length).to.be.equal(1);
                expect(items.find(item => item.name === 'that.is.the.key')).to.be.ok;
            });
            return promise;
        });
    });
});
