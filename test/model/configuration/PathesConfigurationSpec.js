'use strict';

/**
 * Requirements
 */
const PathesConfiguration = require(ES_SOURCE + '/model/configuration/PathesConfiguration.js').PathesConfiguration;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const path = require('path');


/**
 * Spec
 */
describe(PathesConfiguration.className, function()
{
    /**
     * Base Tests
     */
    baseSpec(PathesConfiguration, 'model.configuration/PathesConfiguration');


    /**
     * PathesConfiguration Tests
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });

    // Readonly props
    baseSpec.assertProperty(new PathesConfiguration({ root: '/' }), ['root', 'entoj', 'cache', 'data', 'bower', 'jspm', 'sites']);


    describe('#constructor()', function()
    {
        it('should resolve given root path', function()
        {
            const testee = new PathesConfiguration({ root: __dirname + '/..'});
            expect(testee.root).to.be.equal(path.resolve(__dirname + '/..'));
        });

        it('should uses "cache" as a default path for the cache', function()
        {
            const testee = new PathesConfiguration({ root: __dirname });
            expect(testee.cache).to.be.equal(path.resolve(__dirname + '/cache'));
        });

        it('should generate a cache path based on given template', function()
        {
            const testee = new PathesConfiguration({ root: __dirname, cacheTemplate: '${root}/c'});
            expect(testee.cache).to.be.equal(path.resolve(__dirname + '/c'));
        });

        it('should uses "data" as a default path for the cache', function()
        {
            const testee = new PathesConfiguration({ root: __dirname });
            expect(testee.data).to.be.equal(path.resolve(__dirname + '/data'));
        });

        it('should generate a data path based on given template', function()
        {
            const testee = new PathesConfiguration({ root: __dirname, dataTemplate: '${root}/d'});
            expect(testee.data).to.be.equal(path.resolve(__dirname + '/d'));
        });

        it('should uses "sites" as a default path for sites', function()
        {
            const testee = new PathesConfiguration({ root: __dirname });
            expect(testee.sites).to.be.equal(path.resolve(__dirname + '/sites'));
        });

        it('should generate a sites path based on given template', function()
        {
            const testee = new PathesConfiguration({ root: __dirname, sitesTemplate: '${root}/tpl'});
            expect(testee.sites).to.be.equal(path.resolve(__dirname + '/tpl'));
        });
    });


    describe('#resolveCache', function()
    {
        it('should return a path based on the configured cache template', function()
        {
            const testee = new PathesConfiguration({ root: '/', cacheTemplate: '${root}/yes' });
            const promise = expect(testee.resolveCache('css'))
                .to.eventually.contains(path.sep + 'yes' + path.sep + 'css');
            return promise;
        });
    });


    describe('#resolveSite', function()
    {
        it('should return a path based on the given site', function()
        {
            const testee = new PathesConfiguration({ root: '/', siteTemplate: '${sites}/yes/${site.name}' });
            const promise = expect(testee.resolveSite(global.fixtures.siteBase))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'yes' + path.sep + 'Base');
            return promise;
        });

        it('should allow to add a custom path', function()
        {
            const testee = new PathesConfiguration({ root: '/', siteTemplate: '${sites}/yes/${site.name}' });
            const promise = expect(testee.resolveSite(global.fixtures.siteBase, '/${site.name}'))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'yes' + path.sep + 'Base' + path.sep + 'Base');
            return promise;
        });
    });


    describe('#resolveEntityCategory', function()
    {
        it('should return a path based on the given category', function()
        {
            const testee = new PathesConfiguration({ root: '/',  entityCategoryTemplate: '${sites}/${site.name}/${entityCategory.shortName}' });
            const promise = expect(testee.resolveEntityCategory(global.fixtures.siteBase, global.fixtures.categoryElement))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'Base' + path.sep + 'e');
            return promise;
        });

        it('should allow to add a custom path', function()
        {
            const testee = new PathesConfiguration({ root: '/',  entityCategoryTemplate: '${sites}/${site.name}/${entityCategory.shortName}' });
            const promise = expect(testee.resolveEntityCategory(global.fixtures.siteBase, global.fixtures.categoryElement, '/${entityCategory.longName}'))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'Base' + path.sep + 'e' + path.sep + 'Element');
            return promise;
        });

        it('should allow to use helpers on prototype', function()
        {
            const testee = new PathesConfiguration({ root: '/',  entityCategoryTemplate: '${sites}/${site.name}/${entityCategory.pluralName.urlify()}' });
            const promise = expect(testee.resolveEntityCategory(global.fixtures.siteBase, global.fixtures.categoryModuleGroup))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'Base' + path.sep + 'module-groups');
            return promise;
        });
    });


    describe('#resolveEntityId', function()
    {
        it('should return a path based on the given entity id', function()
        {
            const testee = new PathesConfiguration({ root: '/', entityIdTemplate: '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}' });
            const promise = expect(testee.resolveEntityId(global.fixtures.entityTeaser.id))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'Base' + path.sep + 'm' + path.sep + 'teaser');
            return promise;
        });

        it('should return a path based on the given global entity id', function()
        {
            const testee = new PathesConfiguration({ root: '/', entityIdGlobalTemplate: '${sites}/${site.name}/${entityCategory.shortName}' });
            const promise = expect(testee.resolveEntityId(global.fixtures.entityGlobal.id))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'Base' + path.sep + 'l');
            return promise;
        });

        it('should allow to add a custom path', function()
        {
            const testee = new PathesConfiguration({ root: '/', entityIdTemplate: '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}' });
            const promise = expect(testee.resolveEntityId(global.fixtures.entityTeaser.id, '-${entityId.number.format(3)}'))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'Base' + path.sep + 'm' + path.sep + 'teaser-000');
            return promise;
        });
    });


    describe('#resolveEntityIdForSite', function()
    {
        it('should return a path based on the given entity id and site', function()
        {
            const testee = new PathesConfiguration({ root: '/', entityIdTemplate: '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}' });
            const promise = expect(testee.resolveEntityIdForSite(global.fixtures.entityTeaser.id, global.fixtures.siteExtended))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'Extended' + path.sep + 'm' + path.sep + 'teaser');
            return promise;
        });
    });


    describe('#resolveEntity', function()
    {
        it('should return a path based on the given entity', function()
        {
            const testee = new PathesConfiguration({ root: '/', entityIdTemplate: '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}' });
            const promise = expect(testee.resolveEntity(global.fixtures.entityTeaser))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'Base' + path.sep + 'm' + path.sep + 'teaser');
            return promise;
        });

        it('should return a path based on the given global entity', function()
        {
            const testee = new PathesConfiguration({ root: '/', entityIdGlobalTemplate: '${sites}/${site.name}/${entityCategory.shortName}' });
            const promise = expect(testee.resolveEntity(global.fixtures.entityGlobal))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'Base' + path.sep + 'l');
            return promise;
        });

        it('should allow to add a custom path', function()
        {
            const testee = new PathesConfiguration({ root: '/', entityIdTemplate: '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}' });
            const promise = expect(testee.resolveEntity(global.fixtures.entityTeaser, '-${entityId.number.format(3)}'))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'Base' + path.sep + 'm' + path.sep + 'teaser-000');
            return promise;
        });
    });


    describe('#resolveEntityForSite', function()
    {
        it('should return a path based on the given entity and site', function()
        {
            const testee = new PathesConfiguration({ root: '/', entityIdTemplate: '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}' });
            const promise = expect(testee.resolveEntityForSite(global.fixtures.entityTeaser, global.fixtures.siteExtended))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'Extended' + path.sep + 'm' + path.sep + 'teaser');
            return promise;
        });
    });


    describe('#resolve', function()
    {
        it('should return false when no value object given', function()
        {
            const testee = new PathesConfiguration({ root: '/', siteTemplate: '${sites}/yes/${site.name}' });
            const promise = expect(testee.resolve())
                .to.eventually.be.not.ok;
            return promise;
        });

        it('should return false when unknown value object given', function()
        {
            const testee = new PathesConfiguration({ root: '/', siteTemplate: '${sites}/yes/${site.name}' });
            const promise = expect(testee.resolve({}))
                .to.eventually.be.not.ok;
            return promise;
        });


        it('should return a path based on the given site', function()
        {
            const testee = new PathesConfiguration({ root: '/', siteTemplate: '${sites}/yes/${site.name}' });
            const promise = expect(testee.resolve(global.fixtures.siteBase))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'yes' + path.sep + 'Base');
            return promise;
        });

        it('should return a path based on the given entity', function()
        {
            const testee = new PathesConfiguration({ root: '/', entityIdTemplate: '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}' });
            const promise = expect(testee.resolve(global.fixtures.entityTeaser))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'Base' + path.sep + 'm' + path.sep + 'teaser');
            return promise;
        });

        it('should return a path based on the given entity id', function()
        {
            const testee = new PathesConfiguration({ root: '/', entityIdTemplate: '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}' });
            const promise = expect(testee.resolve(global.fixtures.entityTeaser.id))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'Base' + path.sep + 'm' + path.sep + 'teaser');
            return promise;
        });

        it('should return a path based on the given template', function()
        {
            const testee = new PathesConfiguration({ root: '/' });
            const promise = expect(testee.resolve('${cache}/css'))
                .to.eventually.contains(path.sep + 'cache' + path.sep + 'css');
            return promise;
        });

        it('should allow to add a custom path', function()
        {
            const testee = new PathesConfiguration({ root: '/', entityIdTemplate: '${sites}/${site.name}/${entityCategory.shortName}/${entityId.name}' });
            const promise = expect(testee.resolve(global.fixtures.entityTeaser, '-${entityId.number.format(3)}'))
                .to.eventually.contains(path.sep + 'sites' + path.sep + 'Base' + path.sep + 'm' + path.sep + 'teaser-000');
            return promise;
        });
    });


    describe('#shorten', function()
    {
        it('should return a path without the configured root path', function()
        {
            const testee = new PathesConfiguration({ root: '/path/to' });
            const promise = expect(testee.shorten('/path/to/something/that/is/quite/long'))
                .to.eventually.be.equal('/something/that/is/quite/long');
            return promise;
        });

        it('should return a path with a maximum length', function()
        {
            const testee = new PathesConfiguration({ root: '/path/to' });
            const promise = expect(testee.shorten('/path/to/something/that/is/quite/long', 15))
                .to.eventually.be.equal('/someth…te/long');
            return promise;
        });
    });
});
