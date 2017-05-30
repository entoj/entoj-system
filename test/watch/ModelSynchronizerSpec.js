'use strict';

/**
 * Requirements
 */
const ModelSynchronizer = require(ES_SOURCE + '/watch/ModelSynchronizer.js').ModelSynchronizer;
const FileWatcher = require(ES_SOURCE + '/watch/FileWatcher.js').FileWatcher;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');
const sinon = require('sinon');


/**
 * Spec
 */
describe(ModelSynchronizer.className, function()
{
    /**
     * Base Test
     */
    baseSpec(ModelSynchronizer, 'watch/ModelSynchronizer', function(parameters)
    {
        parameters.unshift(global.fixtures.cliLogger, global.fixtures.fileWatcher,
            global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
        return parameters;
    });


    /**
     * ModelSynchronizer Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
        global.fixtures.cliLogger = new CliLogger('', { muted: true });
        global.fixtures.fileWatcher = new FileWatcher(global.fixtures.cliLogger, global.fixtures.pathesConfiguration,
            global.fixtures.categoriesRepository, global.fixtures.entityIdParser, { debounce: 50 });
    });


    const createTestee = function()
    {
        return new ModelSynchronizer(global.fixtures.cliLogger, global.fixtures.fileWatcher,
            global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);

    };


    describe('#processChanges', function()
    {
        it('should invalidate sites and entities when given a site change', function()
        {
            const promise = co(function *()
            {
                const testee = createTestee();
                const input =
                {
                    site:
                    {
                        add:
                        [
                            '/foo',
                            '/baz'
                        ],
                        remove:
                        [
                            '/bar'
                        ]
                    }
                };
                const sitesInvalidate = sinon.spy(global.fixtures.sitesRepository, 'invalidate');
                const entitiesInvalidate = sinon.spy(global.fixtures.entitiesRepository, 'invalidate');
                yield testee.processChanges(input);
                expect(sitesInvalidate.calledOnce).to.be.ok;
                expect(entitiesInvalidate.calledOnce).to.be.ok;
            });
            return promise;
        });

        it('should invalidate specific entities when given a entity change', function()
        {
            const promise = co(function *()
            {
                const testee = createTestee();
                const input =
                {
                    entity:
                    {
                        add:
                        [
                            '/default/modules/m002-test'
                        ],
                        remove:
                        [
                            '/default/modules/m001-gallery'
                        ]
                    }
                };
                const entitiesInvalidate = sinon.spy(global.fixtures.entitiesRepository, 'invalidate');
                yield testee.processChanges(input);
                expect(entitiesInvalidate.calledOnce).to.be.ok;
                expect(entitiesInvalidate.calledWith(input.entity)).to.be.ok;
            });
            return promise;
        });

        it('dispatch a invalidated signal on changes', function(cb)
        {
            co(function *()
            {
                const testee = createTestee();
                const input =
                {
                    site:
                    {
                        add:
                        [
                            '/foo'
                        ]
                    }
                };
                testee.signals.invalidated.add(function(synchronizer, invalidations)
                {
                    expect(invalidations).to.be.ok;
                    cb();
                });
                yield testee.processChanges(input);
            });
        });

        // @todo do we really need this test?
        xit('should dispatch a object that describes all invalidations', function(cb)
        {
            co(function *()
            {
                const testee = createTestee();
                const input =
                {
                    entity:
                    {
                        add:
                        [
                            '/base/modules/m-foo',
                        ],
                        remove:
                        [
                            '/extended/elements/e-image'
                        ]
                    },
                    site:
                    {
                        add:
                        [
                            'base',
                            'extended'
                        ]
                    },
                    extensions:
                    [
                        '.js'
                    ],
                    files:
                    [
                        '/base/modules/m-foo',
                        '/base/modules/m-foo/js/m-foo.js',
                        '/extended/elements/e-image/js/e-image.js',
                        '/extended/elements/e-image'
                    ],
                    sites:
                    [
                        'base',
                        'extended'
                    ]
                };
                testee.signals.invalidated.add(function(synchronizer, invalidations)
                {
                    expect(invalidations).to.be.ok;
                    cb();
                });
                yield testee.processChanges(input);
            });
        });
    });


    describe('#start', function()
    {
        it('should start the FileWatcher', function(cb)
        {
            const testee = createTestee();
            sinon.spy(global.fixtures.fileWatcher, 'start');
            testee.start().then(function()
            {
                expect(global.fixtures.fileWatcher.start.calledOnce).to.be.ok;
                testee.stop();
                cb();
            });
        });

        it('should not listen to changes from the FileWatcher when not running', function(cb)
        {
            const testee = createTestee();
            sinon.spy(testee, 'processChanges');
            global.fixtures.fileWatcher.signals.changed.dispatch(global.fixtures.fileWatcher, {});
            setTimeout(() =>
            {
                expect(testee.processChanges.callCount).to.be.equal(0);
                cb();
            }, 200);
        });

        it('should listen to changes from the FileWatcher and process them', function(cb)
        {
            const testee = createTestee();
            sinon.spy(testee, 'processChanges');
            testee.start()
                .then(function()
                {
                    global.fixtures.fileWatcher.signals.changed.dispatch(global.fixtures.fileWatcher, {});
                    setTimeout(() =>
                    {
                        expect(testee.processChanges.calledOnce).to.be.ok;
                        testee.stop();
                        cb();
                    }, 200);
                });
        });
    });


    describe('#stop', function()
    {
        it('should stop the FileWatcher', function(cb)
        {
            this.timeout(5000);
            const testee = createTestee();
            sinon.spy(global.fixtures.fileWatcher, 'stop');
            testee.stop()
                .then(function()
                {
                    expect(global.fixtures.fileWatcher.stop.calledOnce).to.be.ok;
                    testee.stop();
                    cb();
                });
        });

        it('should not listen to changes from the FileWatcher when stopped', function(cb)
        {
            const testee = createTestee();
            sinon.spy(testee, 'processChanges');
            testee.start()
                .then(() => testee.stop())
                .then(function()
                {
                    global.fixtures.fileWatcher.signals.changed.dispatch(global.fixtures.fileWatcher, {});
                    setTimeout(() =>
                    {
                        expect(testee.processChanges.callCount).to.be.equal(0);
                        cb();
                    }, 200);
                });
        });
    });
});
