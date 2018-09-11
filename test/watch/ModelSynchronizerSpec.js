'use strict';

/**
 * Requirements
 */
const ModelSynchronizer = require(ES_SOURCE + '/watch/ModelSynchronizer.js').ModelSynchronizer;
const ModelSynchronizerPlugin = require(ES_SOURCE + '/watch/ModelSynchronizerPlugin.js')
    .ModelSynchronizerPlugin;
const ModelSynchronizerSitesPlugin = require(ES_SOURCE + '/watch/ModelSynchronizerSitesPlugin.js')
    .ModelSynchronizerSitesPlugin;
const ModelSynchronizerEntitiesPlugin = require(ES_SOURCE +
    '/watch/ModelSynchronizerEntitiesPlugin.js').ModelSynchronizerEntitiesPlugin;
const FileWatcher = require(ES_SOURCE + '/watch/FileWatcher.js').FileWatcher;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');
const sinon = require('sinon');

/**
 * Spec
 */
describe(ModelSynchronizer.className, function() {
    /**
     * Base Test
     */
    baseSpec(ModelSynchronizer, 'watch/ModelSynchronizer', function(parameters) {
        parameters.unshift(global.fixtures.cliLogger, global.fixtures.fileWatcher);
        return parameters;
    });

    /**
     * ModelSynchronizer Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic();
        global.fixtures.cliLogger = new CliLogger('', { muted: true });
        global.fixtures.fileWatcher = new FileWatcher(
            global.fixtures.cliLogger,
            global.fixtures.pathesConfiguration,
            global.fixtures.categoriesRepository,
            global.fixtures.entityIdParser,
            { debounce: 50 }
        );
    });

    const createTestee = function(plugins) {
        return new ModelSynchronizer(
            global.fixtures.cliLogger,
            global.fixtures.fileWatcher,
            plugins
        );
    };

    describe('#processChanges', function() {
        it('should ask each plugin to execute the changes', function() {
            const promise = co(function*() {
                const plugin = new ModelSynchronizerPlugin(global.fixtures.cliLogger);
                const testee = createTestee([plugin]);
                const input = {};
                const pluginExecuted = sinon.spy(plugin, 'execute');
                yield testee.processChanges(input);
                expect(pluginExecuted.calledOnce).to.be.ok;
            });
            return promise;
        });

        it('should collect all invalidation changes from plugins', function(cb) {
            co(function*() {
                const testee = createTestee([
                    new ModelSynchronizerEntitiesPlugin(
                        global.fixtures.cliLogger,
                        global.fixtures.entitiesRepository
                    ),
                    new ModelSynchronizerSitesPlugin(
                        global.fixtures.cliLogger,
                        global.fixtures.sitesRepository,
                        global.fixtures.entitiesRepository
                    )
                ]);
                const input = {
                    site: {
                        add: ['/foo']
                    },
                    entity: {
                        add: ['/base/modules/m-test'],
                        remove: ['/base/elements/e-cta']
                    }
                };
                testee.signals.invalidated.add(function(synchronizer, invalidations) {
                    expect(invalidations).to.be.ok;
                    expect(invalidations).to.have.property('entity');
                    expect(invalidations).to.have.property('site');
                    cb();
                });
                yield testee.processChanges(input);
            });
        });

        it('should dispatch a invalidated signal with invalidation changes', function(cb) {
            co(function*() {
                const testee = createTestee();
                const input = {
                    site: {
                        add: ['/foo']
                    }
                };
                testee.signals.invalidated.add(function(synchronizer, invalidations) {
                    expect(invalidations).to.be.ok;
                    cb();
                });
                yield testee.processChanges(input);
            });
        });
    });

    describe('#start', function() {
        it('should start the FileWatcher', function(cb) {
            const testee = createTestee();
            sinon.spy(global.fixtures.fileWatcher, 'start');
            testee.start().then(function() {
                expect(global.fixtures.fileWatcher.start.calledOnce).to.be.ok;
                testee.stop();
                cb();
            });
        });

        it('should not listen to changes from the FileWatcher when not running', function(cb) {
            const testee = createTestee();
            sinon.spy(testee, 'processChanges');
            global.fixtures.fileWatcher.signals.changed.dispatch(global.fixtures.fileWatcher, {});
            setTimeout(() => {
                expect(testee.processChanges.callCount).to.be.equal(0);
                cb();
            }, 200);
        });

        it('should listen to changes from the FileWatcher and process them', function(cb) {
            const testee = createTestee();
            sinon.spy(testee, 'processChanges');
            testee.start().then(function() {
                global.fixtures.fileWatcher.signals.changed.dispatch(
                    global.fixtures.fileWatcher,
                    {}
                );
                setTimeout(() => {
                    expect(testee.processChanges.calledOnce).to.be.ok;
                    testee.stop();
                    cb();
                }, 200);
            });
        });
    });

    describe('#stop', function() {
        it('should stop the FileWatcher', function(cb) {
            this.timeout(5000);
            const testee = createTestee();
            sinon.spy(global.fixtures.fileWatcher, 'stop');
            testee.stop().then(function() {
                expect(global.fixtures.fileWatcher.stop.calledOnce).to.be.ok;
                testee.stop();
                cb();
            });
        });

        it('should not listen to changes from the FileWatcher when stopped', function(cb) {
            const testee = createTestee();
            sinon.spy(testee, 'processChanges');
            testee
                .start()
                .then(() => testee.stop())
                .then(function() {
                    global.fixtures.fileWatcher.signals.changed.dispatch(
                        global.fixtures.fileWatcher,
                        {}
                    );
                    setTimeout(() => {
                        expect(testee.processChanges.callCount).to.be.equal(0);
                        cb();
                    }, 200);
                });
        });
    });
});
