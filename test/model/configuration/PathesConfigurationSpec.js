'use strict';

/**
 * Requirements
 */
const PathesConfiguration = require(ES_SOURCE + '/model/configuration/PathesConfiguration.js')
    .PathesConfiguration;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const path = require('path');
const co = require('co');

/**
 * Spec
 */
describe(PathesConfiguration.className, function() {
    /**
     * Base Tests
     */
    baseSpec(PathesConfiguration, 'model.configuration/PathesConfiguration');

    /**
     * PathesConfiguration Tests
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic();
    });

    // Readonly props
    baseSpec.assertProperty(new PathesConfiguration({ root: '/' }), [
        'root',
        'entoj',
        'cache',
        'data',
        'sites'
    ]);

    describe('#constructor()', function() {
        it('should resolve given root path', function() {
            const testee = new PathesConfiguration({ root: __dirname + '/..' });
            expect(testee.root).to.be.equal(path.resolve(__dirname + '/..'));
        });

        it('should uses "cache" as a default path for the cache', function() {
            const testee = new PathesConfiguration({ root: __dirname });
            expect(testee.cache).to.be.equal(path.resolve(__dirname + '/cache'));
        });

        it('should generate a cache path based on given template', function() {
            const testee = new PathesConfiguration({ root: __dirname, cacheTemplate: '${root}/c' });
            expect(testee.cache).to.be.equal(path.resolve(__dirname + '/c'));
        });

        it('should uses "data" as a default path for the cache', function() {
            const testee = new PathesConfiguration({ root: __dirname });
            expect(testee.data).to.be.equal(path.resolve(__dirname + '/data'));
        });

        it('should generate a data path based on given template', function() {
            const testee = new PathesConfiguration({ root: __dirname, dataTemplate: '${root}/d' });
            expect(testee.data).to.be.equal(path.resolve(__dirname + '/d'));
        });

        it('should uses "sites" as a default path for sites', function() {
            const testee = new PathesConfiguration({ root: __dirname });
            expect(testee.sites).to.be.equal(path.resolve(__dirname + '/sites'));
        });

        it('should generate a sites path based on given template', function() {
            const testee = new PathesConfiguration({
                root: __dirname,
                sitesTemplate: '${root}/tpl'
            });
            expect(testee.sites).to.be.equal(path.resolve(__dirname + '/tpl'));
        });
    });

    describe('#resolveCache', function() {
        it('should return a path based on the configured cache template', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({ root: '/', cacheTemplate: '${root}/yes' });
                const result = yield testee.resolveCache('css');
                expect(result).to.be.equal(testee.root + 'yes' + path.sep + 'css');
            });
            return promise;
        });
    });

    describe('#resolveSite', function() {
        it('should return a path based on the given site', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    siteTemplate: '${sites}/yes/${site.name}'
                });
                const result = yield testee.resolveSite(global.fixtures.siteBase);
                expect(result).to.be.equal(
                    testee.root + 'sites' + path.sep + 'yes' + path.sep + 'Base'
                );
            });
            return promise;
        });

        it('should allow to add a custom path', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    siteTemplate: '${sites}/yes/${site.name}'
                });
                const result = yield testee.resolveSite(global.fixtures.siteBase, '/${site.name}');
                expect(result).to.be.equal(
                    testee.root + 'sites' + path.sep + 'yes' + path.sep + 'Base' + path.sep + 'Base'
                );
            });
            return promise;
        });
    });

    describe('#resolveEntityCategory', function() {
        it('should return a path based on the given category', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    entityCategoryTemplate: '${sites}/${site.name}/${entityCategory.shortName}'
                });
                const result = yield testee.resolveEntityCategory(
                    global.fixtures.siteBase,
                    global.fixtures.categoryElement
                );
                expect(result).to.be.equal(
                    testee.root + 'sites' + path.sep + 'Base' + path.sep + 'e'
                );
            });
            return promise;
        });

        it('should allow to add a custom path', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    entityCategoryTemplate: '${sites}/${site.name}/${entityCategory.shortName}'
                });
                const result = yield testee.resolveEntityCategory(
                    global.fixtures.siteBase,
                    global.fixtures.categoryElement,
                    '/${entityCategory.longName}'
                );
                expect(result).to.be.equal(
                    testee.root +
                        'sites' +
                        path.sep +
                        'Base' +
                        path.sep +
                        'e' +
                        path.sep +
                        'Element'
                );
            });
            return promise;
        });

        it('should allow to use helpers on prototype', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    entityCategoryTemplate:
                        '${sites}/${site.name}/${entityCategory.pluralName.urlify()}'
                });
                const result = yield testee.resolveEntityCategory(
                    global.fixtures.siteBase,
                    global.fixtures.categoryModuleGroup
                );
                expect(result).to.be.equal(
                    testee.root + 'sites' + path.sep + 'Base' + path.sep + 'module-groups'
                );
            });
            return promise;
        });
    });

    describe('#resolveEntityId', function() {
        it('should return a path based on the given entity id', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    entityIdTemplate:
                        '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}'
                });
                const result = yield testee.resolveEntityId(global.fixtures.entityTeaser.id);
                expect(result).to.be.equal(
                    testee.root + 'sites' + path.sep + 'Base' + path.sep + 'm' + path.sep + 'teaser'
                );
            });
            return promise;
        });

        it('should return a path based on the given global entity id', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    entityCategoryTemplate: '${sites}/${site.name}/${entityCategory.shortName}'
                });
                const result = yield testee.resolveEntityId(global.fixtures.entityGlobal.id);
                expect(result).to.be.equal(
                    testee.root + 'sites' + path.sep + 'Base' + path.sep + 'l'
                );
            });
            return promise;
        });

        it('should allow to add a custom path', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    entityIdTemplate:
                        '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}'
                });
                const result = yield testee.resolveEntityId(
                    global.fixtures.entityTeaser.id,
                    '-${entityId.number.format(3)}'
                );
                expect(result).to.be.equal(
                    testee.root +
                        'sites' +
                        path.sep +
                        'Base' +
                        path.sep +
                        'm' +
                        path.sep +
                        'teaser-000'
                );
            });
            return promise;
        });
    });

    describe('#resolveEntityIdForSite', function() {
        it('should return a path based on the given entity id and site', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    entityIdTemplate:
                        '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}'
                });
                const result = yield testee.resolveEntityIdForSite(
                    global.fixtures.entityTeaser.id,
                    global.fixtures.siteExtended
                );
                expect(result).to.be.equal(
                    testee.root +
                        'sites' +
                        path.sep +
                        'Extended' +
                        path.sep +
                        'm' +
                        path.sep +
                        'teaser'
                );
            });
            return promise;
        });
    });

    describe('#resolveEntity', function() {
        it('should return a path based on the given entity', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    entityIdTemplate:
                        '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}'
                });
                const result = yield testee.resolveEntity(global.fixtures.entityTeaser);
                expect(result).to.be.equal(
                    testee.root + 'sites' + path.sep + 'Base' + path.sep + 'm' + path.sep + 'teaser'
                );
            });
            return promise;
        });

        it('should return a path based on the given global entity', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    entityCategoryTemplate: '${sites}/${site.name}/${entityCategory.shortName}'
                });
                const result = yield testee.resolveEntity(global.fixtures.entityGlobal);
                expect(result).to.be.equal(
                    testee.root + 'sites' + path.sep + 'Base' + path.sep + 'l'
                );
            });
            return promise;
        });

        it('should allow to add a custom path', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    entityIdTemplate:
                        '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}'
                });
                const result = yield testee.resolveEntity(
                    global.fixtures.entityTeaser,
                    '-${entityId.number.format(3)}'
                );
                expect(result).to.be.equal(
                    testee.root +
                        'sites' +
                        path.sep +
                        'Base' +
                        path.sep +
                        'm' +
                        path.sep +
                        'teaser-000'
                );
            });
            return promise;
        });
    });

    describe('#resolveEntityForSite', function() {
        it('should return a path based on the given entity and site', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    entityIdTemplate:
                        '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}'
                });
                const result = yield testee.resolveEntityForSite(
                    global.fixtures.entityTeaser,
                    global.fixtures.siteExtended
                );
                expect(result).to.be.equal(
                    testee.root +
                        'sites' +
                        path.sep +
                        'Extended' +
                        path.sep +
                        'm' +
                        path.sep +
                        'teaser'
                );
            });
            return promise;
        });
    });

    describe('#resolve', function() {
        it('should return false when no value object given', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    siteTemplate: '${sites}/yes/${site.name}'
                });
                const result = yield testee.resolve();
                expect(result).to.be.not.ok;
            });
            return promise;
        });

        it('should return false when unknown value object given', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    siteTemplate: '${sites}/yes/${site.name}'
                });
                const result = yield testee.resolve({});
                expect(result).to.be.not.ok;
            });
            return promise;
        });

        it('should return a path based on the given site', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    siteTemplate: '${sites}/yes/${site.name}'
                });
                const result = yield testee.resolve(global.fixtures.siteBase);
                expect(result).to.be.equal(
                    testee.root + 'sites' + path.sep + 'yes' + path.sep + 'Base'
                );
            });
            return promise;
        });

        it('should return a path based on the given entity', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    entityIdTemplate:
                        '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}'
                });
                const result = yield testee.resolve(global.fixtures.entityTeaser);
                expect(result).to.be.equal(
                    testee.root + 'sites' + path.sep + 'Base' + path.sep + 'm' + path.sep + 'teaser'
                );
            });
            return promise;
        });

        it('should return a path based on the given entity id', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    entityIdTemplate:
                        '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}'
                });
                const result = yield testee.resolve(global.fixtures.entityTeaser.id);
                expect(result).to.be.equal(
                    testee.root + 'sites' + path.sep + 'Base' + path.sep + 'm' + path.sep + 'teaser'
                );
            });
            return promise;
        });

        it('should return a path based on the given template', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({ root: '/' });
                const result = yield testee.resolve('${cache}/css');
                expect(result).to.be.equal(testee.root + 'cache' + path.sep + 'css');
            });
            return promise;
        });

        it('should return a path based on the given template and variables', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({ root: '/' });
                const result = yield testee.resolve('${cache}/css/${foo}', { foo: 'bar' });
                expect(result).to.be.equal(
                    testee.root + 'cache' + path.sep + 'css' + path.sep + 'bar'
                );
            });
            return promise;
        });

        it('should return a path based on the given template that uses a template', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({ root: '/' });
                const result = yield testee.resolve('${siteTemplate}/css', {
                    site: global.fixtures.siteBase
                });
                expect(result).to.be.equal(
                    testee.root + 'sites' + path.sep + 'base' + path.sep + 'css'
                );
            });
            return promise;
        });

        it('should allow to add a custom path', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({
                    root: '/',
                    entityIdTemplate:
                        '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}'
                });
                const result = yield testee.resolve(
                    global.fixtures.entityTeaser,
                    '-${entityId.number.format(3)}'
                );
                expect(result).to.be.equal(
                    testee.root +
                        'sites' +
                        path.sep +
                        'Base' +
                        path.sep +
                        'm' +
                        path.sep +
                        'teaser-000'
                );
            });
            return promise;
        });
    });

    describe('#shorten', function() {
        it('should return a path without the configured root path', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({ root: '/path/to' });
                const result = yield testee.shorten('/path/to/something/that/is/quite/long');
                expect(result).to.be.equal(
                    path.sep +
                        'something' +
                        path.sep +
                        'that' +
                        path.sep +
                        'is' +
                        path.sep +
                        'quite' +
                        path.sep +
                        'long'
                );
            });
            return promise;
        });

        it('should return a path with a maximum length', function() {
            const promise = co(function*() {
                const testee = new PathesConfiguration({ root: '/path/to' });
                const result = yield testee.shorten('/path/to/something/that/is/quite/long', 15);
                expect(result).to.be.equal(path.sep + 'someth…te' + path.sep + 'long');
            });
            return promise;
        });
    });
});
