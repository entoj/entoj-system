'use strict';

/**
 * Requirements
 */
const EntityPropertiesInheriter = require(ES_SOURCE + '/model/entity/inheriter/EntityPropertiesInheriter.js').EntityPropertiesInheriter;
const EntityAspect = require(ES_SOURCE + '/model/entity/EntityAspect.js').EntityAspect;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');


/**
 * Spec
 */
describe(EntityPropertiesInheriter.className, function()
{
    /**
     * Base Test
     */
    baseSpec(EntityPropertiesInheriter, 'model.entity.inheriter/EntityPropertiesInheriter');


    /**
     * EntityPropertiesInheriter Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });

    describe('#inherit', function()
    {
        it('should use all properties of the aspect site', function()
        {
            const properties =
            {
                base:
                {
                    group:
                    {
                        css: 'all'
                    }
                }
            };
            const testee = new EntityPropertiesInheriter();
            const entity = global.fixtures.entityImage;
            const aspect = new EntityAspect(global.fixtures.entityImage, global.fixtures.siteBase);
            const sites = [global.fixtures.siteBase];
            entity.properties.load(properties, true);
            testee.inherit(sites, entity, aspect);
            expect(aspect.properties.getByPath('group.css')).to.be.equal('all');
        });


        it('should inherit properties of the parent site', function()
        {
            const properties =
            {
                base:
                {
                    group:
                    {
                        css: 'all',
                        js: 'app'
                    }
                },
                extended:
                {
                    group:
                    {
                        css: 'some'
                    }
                }
            };
            const testee = new EntityPropertiesInheriter();
            const entity = global.fixtures.entityImage;
            const aspect = new EntityAspect(global.fixtures.entityImage, global.fixtures.siteExtended);
            const sites = [global.fixtures.siteBase, global.fixtures.siteExtended];
            entity.properties.load(properties, true);
            testee.inherit(sites, entity, aspect);
            expect(aspect.properties.getByPath('group.js')).to.be.equal('app');
            expect(aspect.properties.getByPath('group.css')).to.be.equal('some');
        });
    });
});
