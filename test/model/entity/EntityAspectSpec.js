'use strict';

/**
 * Requirements
 */
const EntityAspect = require(ES_SOURCE + '/model/entity/EntityAspect.js').EntityAspect;
const Site = require(ES_SOURCE + '/model/site/Site.js').Site;
const execute = require(ES_SOURCE + '/utils/synchronize.js').execute;
const valueObjectSpec = require('../ValueObjectShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const baseSpec = require('../../BaseShared.js').spec;


/**
 * Spec
 */
describe(EntityAspect.className, function()
{
    /**
     * ValueObject Test
     */
    valueObjectSpec(EntityAspect, 'model.entity/EntityAspect', function(parameters)
    {
        global.fixtures = projectFixture.createStatic();
        return [global.fixtures.entityImage, global.fixtures.siteBase];
    });


    /**
     * EntityAspect Test
     */
    const createTestee = function()
    {
        global.fixtures = projectFixture.createStatic();
        return new EntityAspect(global.fixtures.entityImage, global.fixtures.siteBase);
    };

    // Simple properties
    baseSpec.assertProperty(createTestee(), ['site'], undefined, Site);
    baseSpec.assertProperty(createTestee(), ['idString'], undefined, 'e-image');
    baseSpec.assertProperty(createTestee(), ['pathString'], undefined, '/base/elements/e-image');
    baseSpec.assertProperty(createTestee(), ['isGlobal'], undefined, false);
});
