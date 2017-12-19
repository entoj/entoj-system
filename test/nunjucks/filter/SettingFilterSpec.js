'use strict';

/**
 * Requirements
 */
const SettingFilter = require(ES_SOURCE + '/nunjucks/filter/SettingFilter.js').SettingFilter;
const SettingsRepository = require(ES_SOURCE + '/model/setting/SettingsRepository.js').SettingsRepository;
const SettingsLoader = require(ES_SOURCE + '/model/setting/SettingsLoader.js').SettingsLoader;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;


/**
 * Spec
 */
describe(SettingFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(SettingFilter, 'nunjucks.filter/SettingFilter');


    /**
     * SettingFilter Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
        global.fixtures.settingsRepository = new SettingsRepository(new SettingsLoader(global.fixtures.pathesConfiguration, ES_FIXTURES + '/model/SettingsModel.json'));
    });


    describe('#filter()', function()
    {
        it('should return a empty object for a unknown setting', function()
        {
            const testee = new SettingFilter().filter();
            expect(testee()).to.be.deep.equal({});
            expect(testee('not.there')).to.be.deep.equal({});
        });

        it('should return a existing setting for an existing key', function()
        {
            const testee = new SettingFilter(global.fixtures.settingsRepository).filter();
            expect(testee('that.is.the.key')).to.be.equal('model');
        });
    });
});
