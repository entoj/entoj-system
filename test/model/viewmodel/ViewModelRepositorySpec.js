'use strict';

/**
 * Requirements
 */
const ViewModelRepository = require(ES_SOURCE + '/model/viewmodel/ViewModelRepository.js').ViewModelRepository;
const ViewModel = require(ES_SOURCE + '/model/viewmodel/ViewModel.js').ViewModel;
const ViewModelPlugin = require(ES_SOURCE + '/model/viewmodel/ViewModelPlugin.js').ViewModelPlugin;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const co = require('co');


/**
 * Spec
 */
describe(ViewModelRepository.className, function()
{
    /**
     * Base Test
     */
    baseSpec(ViewModelRepository, 'model.viewmodel/ViewModelRepository', function(parameters)
    {
        parameters.unshift(global.fixtures.pathesConfiguration);
        parameters.unshift(global.fixtures.entitiesRepository);
        return parameters;
    });


    /**
     * Test Plugin
     */
    class TestPlugin extends ViewModelPlugin
    {
        constructor(name, result)
        {
            super();
            this.result = result;
            this.name = name;
        }

        doExecute(repository, site, useStaticContent, name, parameters)
        {
            return Promise.resolve(this.result);
        }
    }

    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });


    describe('#getByPath', function()
    {
        it('should return a promise', function()
        {
            const testee = new ViewModelRepository(global.fixtures.entitiesRepository, global.fixtures.pathesConfiguration);
            const promise = testee.getByPath();
            expect(promise).to.be.instanceof(Promise);
            return promise;
        });

        it('should resolve to a ViewModel when a full path to a json was given', function()
        {
            const promise = co(function *()
            {
                const testee = new ViewModelRepository(global.fixtures.entitiesRepository, global.fixtures.pathesConfiguration);
                const viewModel = yield testee.getByPath('base/elements/e-image/models/default.json');
                expect(viewModel).to.be.instanceof(ViewModel);
                expect(viewModel.data.image).to.be.equal('placeholder-*.png');
            });
            return promise;
        });

        it('should resolve to a ViewModel with no data when a invalid path to a json was given', function()
        {
            const promise = co(function *()
            {
                const testee = new ViewModelRepository(global.fixtures.entitiesRepository, global.fixtures.pathesConfiguration);
                const viewModel = yield testee.getByPath('bse/elements/e-image/models/default.json');
                expect(viewModel).to.be.instanceof(ViewModel);
                expect(viewModel.data).to.be.not.ok;
            });
            return promise;
        });

        it('should resolve to a ViewModel when a short path in the from entity/model was given', function()
        {
            const promise = co(function *()
            {
                const testee = new ViewModelRepository(global.fixtures.entitiesRepository, global.fixtures.pathesConfiguration);
                const viewModel = yield testee.getByPath('e-image/default');
                expect(viewModel).to.be.instanceof(ViewModel);
                expect(viewModel.data).to.be.ok;
            });
            return promise;
        });

        it('should allow extended sites to override models ', function()
        {
            const promise = co(function *()
            {
                const testee = new ViewModelRepository(global.fixtures.entitiesRepository, global.fixtures.pathesConfiguration);
                const viewModel = yield testee.getByPath('e-image/default', global.fixtures.siteExtended);
                expect(viewModel).to.be.instanceof(ViewModel);
                expect(viewModel.data.image).to.be.equal('placeholder-1.png');
            });
            return promise;
        });

        it('should allow extended sites to use models from its parent', function()
        {
            const promise = co(function *()
            {
                const testee = new ViewModelRepository(global.fixtures.entitiesRepository, global.fixtures.pathesConfiguration);
                const viewModel = yield testee.getByPath('m-teaser/default', global.fixtures.siteExtended);
                expect(viewModel).to.be.instanceof(ViewModel);
                expect(viewModel.data.link).to.be.equal('https://www.google.com');
            });
            return promise;
        });

        it('should support the usage of plugins via @pluginName:options', function()
        {
            const promise = co(function *()
            {
                const testee = new ViewModelRepository(global.fixtures.entitiesRepository, global.fixtures.pathesConfiguration);
                const plugin = new TestPlugin('lipsum', 'lorem ipsum');
                testee.plugins.push(plugin);
                const viewModel = yield testee.getByPath('e-image/default', global.fixtures.siteBase);
                expect(viewModel).to.be.instanceof(ViewModel);
                expect(viewModel.data.alt).to.be.equal('lorem ipsum');
            });
            return promise;
        });
    });
});
