'use strict';

/**
 * Requirements
 */
const GlobalRepository = require(ES_SOURCE + '/model/GlobalRepository.js').GlobalRepository;
const Site = require(ES_SOURCE + '/model/site/Site.js').Site;
const EntityCategory = require(ES_SOURCE + '/model/entity/EntityCategory.js').EntityCategory;
const Entity = require(ES_SOURCE + '/model/entity/Entity.js').Entity;
const EntityAspect = require(ES_SOURCE + '/model/entity/EntityAspect.js').EntityAspect;
const DocumentationCallable = require(ES_SOURCE + '/model/documentation/DocumentationCallable.js').DocumentationCallable;
const ContentType = require(ES_SOURCE + '/model/ContentType.js').ContentType;
const ContentKind = require(ES_SOURCE + '/model/ContentKind.js').ContentKind;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const co = require('co');


/**
 * Spec
 */
describe(GlobalRepository.className, function()
{
    /**
     * Base Test
     */
    baseSpec(GlobalRepository, 'model/GlobalRepository', function(parameters)
    {
        parameters.unshift(global.fixtures.entitiesRepository);
        parameters.unshift(global.fixtures.categoriesRepository);
        parameters.unshift(global.fixtures.sitesRepository);
        return parameters;
    });


    /**
     * GlobalRepository Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
        const macro = new DocumentationCallable(
            {
                name: 'm_teaser',
                contentType: ContentType.JINJA,
                contentKind: ContentKind.MACRO,
                site: global.fixtures.siteBase
            });
        global.fixtures.entityTeaser.documentation.push(macro);
    });


    describe('#resolve', function()
    {
        it('should resolve "*" to all Sites', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = testee.resolve('*').then(function(result)
            {
                expect(result).to.be.ok;
                expect(result.site).to.have.length(2);
                expect(result.site[0]).to.be.instanceof(Site);
                expect(result.site[1]).to.be.instanceof(Site);
            });
            return promise;
        });

        it('should resolve "base" to a Site', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = testee.resolve('base').then(function(result)
            {
                expect(result).to.be.ok;
                expect(result.site).to.be.instanceof(Site);
                expect(result.site.name).to.be.equal('Base');
            });
            return promise;
        });

        it('should resolve "global" to a EntityCategory', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = testee.resolve('global').then(function(result)
            {
                expect(result).to.be.ok;
                expect(result.entityCategory).to.be.instanceof(EntityCategory);
                expect(result.entityCategory.longName).to.be.equal('Global');
            });
            return promise;
        });

        it('should resolve "m-teaser" to a EntityAspect', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = testee.resolve('m-teaser').then(function(result)
            {
                expect(result).to.be.ok;
                expect(result.entity).to.be.instanceof(Entity);
                expect(result.entity.id.name).to.be.equal('teaser');
            });
            return promise;
        });

        it('should resolve "base/modules/m-teaser" to a EntityAspect', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = testee.resolve('base/modules/m-teaser').then(function(result)
            {
                expect(result).to.be.ok;
                expect(result.entity).to.be.instanceof(EntityAspect);
                expect(result.entity.id.name).to.be.equal('teaser');
            });
            return promise;
        });

        it('should resolve "base/global" to a Site and EntityCategory', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = testee.resolve('base/global').then(function(result)
            {
                expect(result).to.be.ok;
                expect(result.site).to.be.instanceof(Site);
                expect(result.site.name).to.be.equal('Base');
                expect(result.entityCategory).to.be.instanceof(EntityCategory);
                expect(result.entityCategory.longName).to.be.equal('Global');
            });
            return promise;
        });
    });

    describe('#resolveEntities', function()
    {
        it('should resolve "*" to all Entities', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = testee.resolveEntities('*').then(function(result)
            {
                expect(result).to.be.ok;
                expect(result).to.have.length(9);
                expect(result[0]).to.be.instanceof(EntityAspect);
            });
            return promise;
        });

        it('should resolve "base" to all Entities of a Site', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = testee.resolveEntities('base').then(function(result)
            {
                expect(result).to.be.ok;
                expect(result).to.have.length(8);
                expect(result[0]).to.be.instanceof(EntityAspect);
            });
            return promise;
        });

        it('should resolve "global" to all Entities of a EntityCategory', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = testee.resolveEntities('elements').then(function(result)
            {
                expect(result).to.be.ok;
                expect(result).to.have.length(3);
                expect(result[0]).to.be.instanceof(Entity);
            });
            return promise;
        });

        it('should resolve "m-teaser" to a Entity', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = testee.resolveEntities('m-teaser').then(function(result)
            {
                expect(result).to.be.ok;
                expect(result).to.have.length(1);
                expect(result[0]).to.be.instanceof(Entity);
            });
            return promise;
        });

        it('should resolve "base/modules/m-teaser" to a EntityAspect', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = testee.resolveEntities('base/modules/m-teaser').then(function(result)
            {
                expect(result).to.be.ok;
                expect(result).to.have.length(1);
                expect(result[0]).to.be.instanceof(EntityAspect);
            });
            return promise;
        });

        it('should resolve "base/modules" to all Entities of EntityCategory of a Site', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = testee.resolveEntities('base/modules').then(function(result)
            {
                expect(result).to.be.ok;
                expect(result).to.have.length(1);
                expect(result[0]).to.be.instanceof(EntityAspect);
            });
            return promise;
        });
    });


    describe('#resolveMacro', function()
    {
        it('should resolve to false for a non existing site', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = co(function *()
            {
                const macro = yield testee.resolveMacro('foo', 'm_teaser');
                expect(macro).to.be.not.ok;
            });
            return promise;
        });

        it('should resolve to false for a non existing macro', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = co(function *()
            {
                const macro = yield testee.resolveMacro('base', 'foo');
                expect(macro).to.be.not.ok;
            });
            return promise;
        });

        it('should resolve to a existing macro when given a valid site name and macro name', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = co(function *()
            {
                const macro = yield testee.resolveMacro('base', 'm_teaser');
                expect(macro).to.be.instanceof(DocumentationCallable);
                expect(macro.name).to.be.equal('m_teaser');
            });
            return promise;
        });

        it('should resolve to a existing macro when given a valid site and a macro name', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = co(function *()
            {
                const site = yield global.fixtures.sitesRepository.findBy(Site.ANY, 'base');
                const macro = yield testee.resolveMacro(site, 'm_teaser');
                expect(macro).to.be.instanceof(DocumentationCallable);
                expect(macro.name).to.be.equal('m_teaser');
            });
            return promise;
        });

        it('should resolve to a existing macro when given only a macro name', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = co(function *()
            {
                const macro = yield testee.resolveMacro(undefined, 'm_teaser');
                expect(macro).to.be.instanceof(DocumentationCallable);
                expect(macro.name).to.be.equal('m_teaser');
            });
            return promise;
        });
    });


    describe('#resolveEntityForMacro', function()
    {
        it('should resolve to false for a non existing site', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = co(function *()
            {
                const entity = yield testee.resolveEntityForMacro('foo', 'm_teaser');
                expect(entity).to.be.not.ok;
            });
            return promise;
        });

        it('should resolve to false for a non existing macro', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = co(function *()
            {
                const entity = yield testee.resolveEntityForMacro('base', 'foo');
                expect(entity).to.be.not.ok;
            });
            return promise;
        });

        it('should resolve to a existing macro when given a valid site name and macro name', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = co(function *()
            {
                const entity = yield testee.resolveEntityForMacro('base', 'm_teaser');
                expect(entity).to.be.instanceof(EntityAspect);
                expect(entity.idString).to.be.equal('m-teaser');
            });
            return promise;
        });

        it('should resolve to a existing macro when given a valid site and a macro name', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = co(function *()
            {
                const site = yield global.fixtures.sitesRepository.findBy(Site.ANY, 'base');
                const entity = yield testee.resolveEntityForMacro(site, 'm_teaser');
                expect(entity).to.be.instanceof(EntityAspect);
                expect(entity.idString).to.be.equal('m-teaser');
            });
            return promise;
        });

        it('should resolve to a existing macro when given only a macro name', function()
        {
            const testee = new GlobalRepository(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, global.fixtures.entitiesRepository);
            const promise = co(function *()
            {
                const entity = yield testee.resolveEntityForMacro(undefined, 'm_teaser');
                expect(entity).to.be.instanceof(EntityAspect);
                expect(entity.idString).to.be.equal('m-teaser');
            });
            return promise;
        });
    });
});
