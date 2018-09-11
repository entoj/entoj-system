'use strict';

/**
 * Requirements
 */
const FileWatcher = require(ES_SOURCE + '/watch/FileWatcher.js').FileWatcher;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');
const sinon = require('sinon');

/**
 * Spec
 */
describe(FileWatcher.className, function() {
    /**
     * Base Test
     */
    baseSpec(FileWatcher, 'watch/FileWatcher', function(parameters) {
        parameters.unshift(
            global.fixtures.cliLogger,
            global.fixtures.pathesConfiguration,
            global.fixtures.categoriesRepository,
            global.fixtures.entityIdParser
        );
        return parameters;
    });

    /**
     * FileWatcher Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic();
        global.fixtures.cliLogger = new CliLogger('', { muted: true });
        //global.fixtures.reset();
    });

    const createTestee = function() {
        return new FileWatcher(
            global.fixtures.cliLogger,
            global.fixtures.pathesConfiguration,
            global.fixtures.categoriesRepository,
            global.fixtures.entityIdParser
        );
    };

    describe('#processEvents', function() {
        it('should create site changes for pathes like /site or /site/file.ext', function() {
            const promise = co(function*() {
                const testee = createTestee();
                const input = [
                    { name: 'add', path: '/foo' },
                    { name: 'add', path: '/baz/package.json' },
                    { name: 'remove', path: '/bar' }
                ];
                const expected = {
                    site: {
                        add: ['/foo', '/baz'],
                        remove: ['/bar']
                    },
                    extensions: ['.json'],
                    files: ['/foo', '/baz/package.json', '/bar'],
                    sites: ['foo', 'baz', 'bar']
                };
                const changes = yield testee.processEvents(input);
                expect(changes).to.be.deep.equal(expected);
            });
            return promise;
        });

        it('should create entity category changes for pathes like /site/modules that contain a valid EntityCategory', function() {
            const promise = co(function*() {
                const testee = createTestee();
                const input = [
                    { name: 'add', path: '/foo/modules' },
                    { name: 'remove', path: '/bar/modules' },
                    { name: 'add', path: '/bar/bar' }
                ];
                const expected = {
                    entityCategory: {
                        add: ['/foo/modules'],
                        remove: ['/bar/modules']
                    },
                    extensions: [],
                    files: ['/foo/modules', '/bar/modules', '/bar/bar'],
                    sites: ['foo', 'bar']
                };
                const changes = yield testee.processEvents(input);
                expect(changes).to.be.deep.equal(expected);
            });
            return promise;
        });

        it('should create entity changes for pathes like /site/modules/m-gallery or /site/modules/m-gallery/js/m-gallery.js that contain a valid EntityId', function() {
            const promise = co(function*() {
                const testee = createTestee();
                const input = [
                    { name: 'add', path: '/foo/modules/m-foo' },
                    { name: 'add', path: '/site/modules/m-teaser/js/m-teaser.js' },
                    { name: 'remove', path: '/bar/modules/m-bar' },
                    { name: 'add', path: '/bar/bar/m-foo' }
                ];
                const expected = {
                    entity: {
                        add: ['/foo/modules/m-foo', '/site/modules/m-teaser'],
                        remove: ['/bar/modules/m-bar']
                    },
                    extensions: ['.js'],
                    files: [
                        '/foo/modules/m-foo',
                        '/site/modules/m-teaser/js/m-teaser.js',
                        '/bar/modules/m-bar',
                        '/bar/bar/m-foo'
                    ],
                    sites: ['foo', 'site', 'bar']
                };
                const changes = yield testee.processEvents(input);
                expect(changes).to.be.deep.equal(expected);
            });
            return promise;
        });

        it('should treat removal of files within entities as "add"', function() {
            const promise = co(function*() {
                const testee = createTestee();
                const input = [
                    { name: 'remove', path: '/foo/package.json' },
                    { name: 'remove', path: '/foo/modules/package.json' },
                    { name: 'remove', path: '/foo/modules/m-foo/package.json' }
                ];
                const expected = {
                    site: {
                        add: ['/foo']
                    },
                    entityCategory: {
                        add: ['/foo/modules']
                    },
                    entity: {
                        add: ['/foo/modules/m-foo']
                    },
                    extensions: ['.json'],
                    files: [
                        '/foo/package.json',
                        '/foo/modules/package.json',
                        '/foo/modules/m-foo/package.json'
                    ],
                    sites: ['foo']
                };
                const changes = yield testee.processEvents(input);
                expect(changes).to.be.deep.equal(expected);
            });
            return promise;
        });

        it('should remove a entity when all files are deleted', function() {
            const promise = co(function*() {
                const testee = createTestee();
                const input = [
                    { name: 'remove', path: '/foo/modules/m-foo/package.json' },
                    { name: 'remove', path: '/foo/modules/m-foo' }
                ];
                const expected = {
                    entity: {
                        remove: ['/foo/modules/m-foo']
                    },
                    extensions: ['.json'],
                    files: ['/foo/modules/m-foo/package.json', '/foo/modules/m-foo'],
                    sites: ['foo']
                };
                const changes = yield testee.processEvents(input);
                expect(changes).to.be.deep.equal(expected);
            });
            return promise;
        });

        it('should ignore duplicate changes', function() {
            const promise = co(function*() {
                const testee = createTestee();
                const input = [
                    { name: 'add', path: '/foo/modules/m-foo/package.json' },
                    { name: 'add', path: '/foo/modules/m-foo/m-foo.md' }
                ];
                const expected = {
                    entity: {
                        add: ['/foo/modules/m-foo']
                    },
                    extensions: ['.json', '.md'],
                    files: ['/foo/modules/m-foo/package.json', '/foo/modules/m-foo/m-foo.md'],
                    sites: ['foo']
                };
                const changes = yield testee.processEvents(input);
                expect(changes).to.be.deep.equal(expected);
            });
            return promise;
        });

        it('should recognize changes in global entities', function() {
            const promise = co(function*() {
                const testee = createTestee();
                const input = [{ name: 'change', path: '/foo/global/macros/helpers.j2' }];
                const expected = {
                    entity: {
                        add: ['/foo/global']
                    },
                    extensions: ['.j2'],
                    files: ['/foo/global/macros/helpers.j2'],
                    sites: ['foo']
                };
                const changes = yield testee.processEvents(input);
                expect(changes).to.be.deep.equal(expected);
                return true;
            });
            return promise;
        });

        it('should recognize changes of entity files', function() {
            const promise = co(function*() {
                const testee = createTestee();
                const input = [
                    { name: 'change', path: '/base/module-groups/g-footer/g-footer.md' }
                ];
                const expected = {
                    entity: {
                        add: ['/base/module-groups/g-footer']
                    },
                    extensions: ['.md'],
                    files: ['/base/module-groups/g-footer/g-footer.md'],
                    sites: ['base']
                };
                const changes = yield testee.processEvents(input);
                expect(changes).to.be.deep.equal(expected);
                return true;
            });
            return promise;
        });

        it('should dispatch signals.changed', function(cb) {
            const testee = createTestee();
            const data = [{ name: 'add', path: '/foo/modules/m-foo/js/m-foo.js' }];
            testee.signals.changed.add(function(watcher, changes) {
                expect(changes).to.be.ok;
                cb();
            });
            testee.processEvents(data);
        });
    });

    describe('#addEvent', function() {
        it('should bundle events for #processEvents', function(cb) {
            const testee = createTestee();
            sinon.spy(testee.signals.changed, 'dispatch');
            testee.addEvent('addDir', 'foo');
            testee.addEvent('addDir', 'foo/modules');
            testee.addEvent('addDir', 'foo/modules/m-foo');
            testee.addEvent('add', 'foo/modules/m-foo/m-foo.j2');
            testee.addEvent('add', 'foo/modules/x-foo/m-foo.j2');
            setTimeout(() => {
                expect(testee.signals.changed.dispatch.calledOnce).to.be.ok;
                cb();
            }, 350);
        });
    });

    // This test segfaults?
    describe('#start', function() {
        it('should return a promise that resolves when intialized', function() {
            const testee = createTestee();
            const result = testee.start();
            expect(result).to.be.instanceof(Promise);
            return result;
        });

        xit('should watch files starting at the sites root', function(cb) {
            const testee = createTestee();
            const expected = {
                entityCategory: {
                    add: ['/default/modules']
                },
                entity: {
                    add: ['/default/modules/m001-gallery']
                },
                files: [
                    '/default/modules',
                    '/default/modules/m001-gallery',
                    '/default/modules/m001-gallery/examples',
                    '/default/modules/m001-gallery/examples/default.j2',
                    '/default/modules/m001-gallery/examples/hero.j2',
                    '/default/modules/m001-gallery/image',
                    '/default/modules/m001-gallery/image/south-park1.jpg',
                    '/default/modules/m001-gallery/js',
                    '/default/modules/m001-gallery/js/m001-gallery-helper.js',
                    '/default/modules/m001-gallery/js/m001-gallery.js',
                    '/default/modules/m001-gallery/m001-gallery.j2',
                    '/default/modules/m001-gallery/m001-gallery.md',
                    '/default/modules/m001-gallery/macros',
                    '/default/modules/m001-gallery/macros/helper.j2',
                    '/default/modules/m001-gallery/model',
                    '/default/modules/m001-gallery/model/default.json',
                    '/default/modules/m001-gallery/package.json',
                    '/default/modules/m001-gallery/sass',
                    '/default/modules/m001-gallery/sass/m001-gallery.scss'
                ],
                extensions: ['.j2', '.jpg', '.js', '.md', '.json', '.scss'],
                sites: ['default']
            };
            testee.signals.changed.add(function(watcher, changes) {
                testee.stop();
                expect(changes).to.be.ok;
                expect(changes).to.be.deep.equal(expected);
                cb();
            });
            testee.start().then(function() {
                global.fixtures.copy('/default/modules/m001-gallery');
            });
        });
    });
});
