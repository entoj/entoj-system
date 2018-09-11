'use strict';

/**
 * Requirements
 */
const ViewModelRepository = require(ES_SOURCE + '/model/viewmodel/ViewModelRepository.js')
    .ViewModelRepository;
const ViewModelLipsumPlugin = require(ES_SOURCE +
    '/model/viewmodel/plugin/ViewModelLipsumPlugin.js').ViewModelLipsumPlugin;
const viewModelPluginSpec = require('../ViewModelPluginShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');

/**
 * Spec
 */
describe(ViewModelLipsumPlugin.className, function() {
    /**
     * Base Test
     */
    viewModelPluginSpec(ViewModelLipsumPlugin, 'model.viewmodel.plugin/ViewModelLipsumPlugin');

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
                const testee = new ViewModelLipsumPlugin();
                const result = yield testee.execute(
                    global.fixtures.viewModelRepository,
                    global.fixtures.siteBase,
                    false,
                    'foo',
                    ''
                );
                expect(result).to.be.not.ok;
            });
            return promise;
        });

        describe('staticContent=false', function() {
            it('should generate a lipsum text with at least a word via @lipsum', function() {
                const promise = co(function*() {
                    const testee = new ViewModelLipsumPlugin();
                    const result = yield testee.execute(
                        global.fixtures.viewModelRepository,
                        global.fixtures.siteBase,
                        false,
                        'lipsum',
                        ''
                    );
                    expect(result).to.be.ok;
                    expect(result).to.have.length.above(2);
                });
                return promise;
            });

            it('should allow to generate a text with configurable words via @lipsum:w,4,6', function() {
                const promise = co(function*() {
                    const testee = new ViewModelLipsumPlugin();
                    const result = yield testee.execute(
                        global.fixtures.viewModelRepository,
                        global.fixtures.siteBase,
                        false,
                        'lipsum',
                        'w,4,6'
                    );
                    expect(result).to.be.ok;
                    expect(result.split(' ')).to.have.length.above(4);
                });
                return promise;
            });

            it('should allow to generate a text with configurable sentences via @lipsum:s,2,4', function() {
                const promise = co(function*() {
                    const testee = new ViewModelLipsumPlugin();
                    const result = yield testee.execute(
                        global.fixtures.viewModelRepository,
                        global.fixtures.siteBase,
                        false,
                        'lipsum',
                        's,2,4'
                    );
                    expect(result).to.be.ok;
                    expect(result.split(' ')).to.have.length.above(3);
                    expect(result.split('.')).to.have.length.above(1);
                });
                return promise;
            });

            it('should allow to generate a text with configurable paragraphs via @lipsum:p,2,4', function() {
                const promise = co(function*() {
                    const testee = new ViewModelLipsumPlugin();
                    const result = yield testee.execute(
                        global.fixtures.viewModelRepository,
                        global.fixtures.siteBase,
                        false,
                        'lipsum',
                        'p,2,4'
                    );
                    expect(result).to.be.ok;
                    expect(result.split('\n')).to.have.length.above(1);
                    expect(result.split(' ')).to.have.length.above(7);
                    expect(result.split('.')).to.have.length.above(3);
                });
                return promise;
            });
        });

        describe('staticContent=true', function() {
            it('should generate a static lipsum text', function() {
                const promise = co(function*() {
                    const testee = new ViewModelLipsumPlugin();
                    const result1 = yield testee.execute(
                        global.fixtures.viewModelRepository,
                        global.fixtures.siteBase,
                        true,
                        'lipsum',
                        ''
                    );
                    const result2 = yield testee.execute(
                        global.fixtures.viewModelRepository,
                        global.fixtures.siteBase,
                        true,
                        'lipsum',
                        ''
                    );
                    expect(result1).to.be.ok;
                    expect(result1).to.have.length.above(2);
                    expect(result2).to.be.ok;
                    expect(result2).to.have.length.above(2);
                    expect(result1).to.be.equal(result2);
                });
                return promise;
            });
        });
    });
});
