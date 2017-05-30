'use strict';

/**
 * Requirements
 */
const ViewModelRepository = require(ES_SOURCE + '/model/viewmodel/ViewModelRepository.js').ViewModelRepository;
const ViewModelImagePlugin = require(ES_SOURCE + '/model/viewmodel/plugin/ViewModelImagePlugin.js').ViewModelImagePlugin;
const viewModelPluginSpec = require('../ViewModelPluginShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');


/**
 * Spec
 */
describe(ViewModelImagePlugin.className, function()
{
    /**
     * Base Test
     */
    viewModelPluginSpec(ViewModelImagePlugin, 'model.viewmodel.plugin/ViewModelImagePlugin');


    /**
     * ViewModelLipsumPlugin Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
        global.fixtures.viewModelRepository = new ViewModelRepository(global.fixtures.entitiesRepository, global.fixtures.pathesConfiguration);
    });


    describe('#execute', function()
    {
        it('should return undefined if name does not match', function()
        {
            const promise = co(function*()
            {
                const testee = new ViewModelImagePlugin();
                const result = yield testee.execute(global.fixtures.viewModelRepository,
                    global.fixtures.siteBase,
                    false,
                    'foo',
                    '');
                expect(result).to.be.not.ok;
            });
            return promise;
        });

        describe('staticContent=false', function()
        {
            it('should return a random image via @image:placeholder-*', function()
            {
                const promise = co(function*()
                {
                    const testee = new ViewModelImagePlugin();
                    const result = yield testee.execute(global.fixtures.viewModelRepository,
                        global.fixtures.siteBase,
                        false,
                        'image',
                        'placeholder-*');
                    expect(result).to.be.ok;
                    expect(result).to.not.contain('*');
                });
                return promise;
            });
        });

        describe('staticContent=true', function()
        {
            it('should return the first image via @image:placeholder-*', function()
            {
                const promise = co(function*()
                {
                    const testee = new ViewModelImagePlugin();
                    const result = yield testee.execute(global.fixtures.viewModelRepository,
                        global.fixtures.siteBase,
                        true,
                        'image',
                        'placeholder-*');
                    expect(result).to.be.ok;
                    expect(result).to.be.equal('placeholder-01.png');
                });
                return promise;
            });
        });
    });
});
