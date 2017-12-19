'use strict';

/**
 * Requirements
 */
const EntitiesLoader = require(ES_SOURCE + '/model/entity/EntitiesLoader.js').EntitiesLoader;
const Entity = require(ES_SOURCE + '/model/entity/Entity.js').Entity;
const Site = require(ES_SOURCE + '/model/site/Site.js').Site;
const loaderSpec = require('../LoaderShared.js');
const MarkdownPlugin = require(ES_SOURCE + '/model/loader/documentation').MarkdownPlugin;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');


/**
 * Spec
 */
describe(EntitiesLoader.className, function()
{
    loaderSpec(EntitiesLoader, 'model.entity/EntitiesLoader', function(parameters)
    {
        parameters.unshift(global.fixtures.sitesRepository, global.fixtures.categoriesRepository,
            global.fixtures.entityIdParser, global.fixtures.pathesConfiguration);
        return parameters;
    });


    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });


    describe('#load', function()
    {
        it('should resolve to Entity instances extracted from the given directory structure', function()
        {
            const testee = new EntitiesLoader(global.fixtures.sitesRepository, global.fixtures.categoriesRepository,
                global.fixtures.entityIdParser, global.fixtures.pathesConfiguration);
            const promise = co(function *()
            {
                const items = yield testee.load();
                expect(items).to.have.length(10);
                expect(items.find(item => item.id.name == 'cta')).to.be.instanceof(Entity);
                expect(items.find(item => item.id.name == 'headline')).to.be.instanceof(Entity);
                expect(items.find(item => item.id.name == 'image')).to.be.instanceof(Entity);
                expect(items.find(item => item.id.category.longName == 'Global')).to.be.instanceof(Entity);
                expect(items.find(item => item.id.name == 'imagetext')).to.be.instanceof(Entity);
            });
            return promise;
        });

        it('should resolve to Entity instances that have a Site assigned', function()
        {
            const testee = new EntitiesLoader(global.fixtures.sitesRepository, global.fixtures.categoriesRepository,
                global.fixtures.entityIdParser, global.fixtures.pathesConfiguration);
            const promise = co(function *()
            {
                const items = yield testee.load();
                expect(items.find(item => item.id.name == 'cta').id.site).to.be.instanceof(Site);
            });
            return promise;
        });

        it('should resolve to Entity instances that knows each Site they are used in (via extend)', function()
        {
            const testee = new EntitiesLoader(global.fixtures.sitesRepository, global.fixtures.categoriesRepository,
                global.fixtures.entityIdParser, global.fixtures.pathesConfiguration);
            const promise = co(function *()
            {
                const items = yield testee.load();
                expect(items.find(item => item.id.name == 'image').usedBy).to.contain(global.fixtures.siteExtended);
            });
            return promise;
        });

        it('should allow to load only specific entities', function()
        {
            const testee = new EntitiesLoader(global.fixtures.sitesRepository, global.fixtures.categoriesRepository,
                global.fixtures.entityIdParser, global.fixtures.pathesConfiguration);
            const promise = co(function *()
            {
                const items = yield testee.load(['/base/modules/m-teaser', '/base/elements/e-cta']);
                expect(items).to.have.length(2);
                expect(items.find(item => item.id.name == 'teaser')).to.be.instanceof(Entity);
                expect(items.find(item => item.id.name == 'cta')).to.be.instanceof(Entity);
            });
            return promise;
        });

        it('should ignore invalid entities', function()
        {
            const testee = new EntitiesLoader(global.fixtures.sitesRepository, global.fixtures.categoriesRepository,
                global.fixtures.entityIdParser, global.fixtures.pathesConfiguration);
            const promise = co(function *()
            {
                const items = yield testee.load(['/invalid/modules/m001-gallery']);
                expect(items).to.have.length(0);
            });
            return promise;
        });

        it('should load Files from base and extended versions ', function()
        {
            const plugin = new MarkdownPlugin(global.fixtures.pathesConfiguration);
            const testee = new EntitiesLoader(global.fixtures.sitesRepository, global.fixtures.categoriesRepository,
                global.fixtures.entityIdParser, global.fixtures.pathesConfiguration, [plugin]);
            const promise = co(function *()
            {
                const items = yield testee.load();
                const entity = items.find(item => item.id.name == 'image');
                expect(entity.files.filter(file => file.site.name === 'Base')).has.length(1);
                expect(entity.files.filter(file => file.site.name === 'Extended')).has.length(1);
            });
            return promise;
        });
    });
});
