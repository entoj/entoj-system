'use strict';

/**
 * Requirements
 */
const ViewModelRepository = require(ES_SOURCE + '/model/viewmodel/ViewModelRepository.js')
    .ViewModelRepository;
const ViewModelImportPlugin = require(ES_SOURCE +
    '/model/viewmodel/plugin/ViewModelImportPlugin.js').ViewModelImportPlugin;
const viewModelPluginSpec = require('../ViewModelPluginShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');

/**
 * Spec
 */
describe(ViewModelImportPlugin.className, function() {
    /**
     * Base Test
     */
    viewModelPluginSpec(ViewModelImportPlugin, 'model.viewmodel.plugin/ViewModelImportPlugin');

    /**
     * ViewModelLipsumPlugin Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic();
        global.fixtures.viewModelRepository = new ViewModelRepository(
            global.fixtures.entitiesRepository,
            global.fixtures.pathesConfiguration
        );
    });

    describe('#execute', function() {
        it('should return undefined if name does not match', function() {
            const promise = co(function*() {
                const testee = new ViewModelImportPlugin();
                const result = yield testee.execute(
                    global.fixtures.viewModelRepository,
                    global.fixtures.siteBase,
                    {},
                    'foo',
                    ''
                );
                expect(result).to.be.not.ok;
            });
            return promise;
        });

        it('should allow to load another json in place via @import:e-image/default', function() {
            const promise = co(function*() {
                const testee = new ViewModelImportPlugin();
                const result = yield testee.execute(
                    global.fixtures.viewModelRepository,
                    global.fixtures.siteBase,
                    {},
                    'import',
                    'e-image/default'
                );
                expect(result).to.be.ok;
                expect(result.image).to.be.ok;
                expect(result.alt).to.be.ok;
            });
            return promise;
        });
    });
});
