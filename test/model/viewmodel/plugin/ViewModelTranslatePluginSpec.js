'use strict';

/**
 * Requirements
 */
const ViewModelTranslatePlugin = require(ES_SOURCE + '/model/viewmodel/plugin/ViewModelTranslatePlugin.js').ViewModelTranslatePlugin;
const viewModelPluginSpec = require('../ViewModelPluginShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');


/**
 * Spec
 */
describe(ViewModelTranslatePlugin.className, function()
{
    /**
     * Base Test
     */
    viewModelPluginSpec(ViewModelTranslatePlugin, 'model.viewmodel.plugin/ViewModelTranslatePlugin', () =>
    {
        return [global.fixtures.translationsRepository, global.fixtures.systemConfiguration];
    });


    /**
     * ViewModelTranslatePlugin Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createDynamic();
    });

    describe('#execute', function()
    {
        it('should return a translation for the given key', function()
        {
            const promise = co(function*()
            {
                const testee = new ViewModelTranslatePlugin(global.fixtures.translationsRepository, global.fixtures.systemConfiguration);
                const result = yield testee.execute(global.fixtures.viewModelRepository,
                    global.fixtures.siteBase,
                    false,
                    'translate',
                    'site');
                expect(result).to.be.ok;
                expect(result).to.be.equal('base');
            });
            return promise;
        });
    });
});
