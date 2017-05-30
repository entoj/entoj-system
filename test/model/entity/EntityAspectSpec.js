'use strict';

/**
 * Requirements
 */
const EntityAspect = require(ES_SOURCE + '/model/entity/EntityAspect.js').EntityAspect;
const Site = require(ES_SOURCE + '/model/site/Site.js').Site;
const MissingArgumentError = require(ES_SOURCE + '/error/MissingArgumentError.js').MissingArgumentError;
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
    const prepareParameters = function(parameters)
    {
        const fixture = projectFixture.createStatic();
        return [fixture.entityImage, fixture.siteBase];
    };
    valueObjectSpec(EntityAspect, 'model.entity/EntityAspect', prepareParameters);


    /**
     * Entity Test
     */
    const createTestee = function()
    {
        let parameters = Array.from(arguments);
        if (prepareParameters)
        {
            parameters = prepareParameters(parameters);
        }
        return new EntityAspect(...parameters);
    };

    // Simple properties
    baseSpec.assertProperty(createTestee(), ['site'], undefined, Site);
    baseSpec.assertProperty(createTestee(), ['idString'], undefined, 'e-image');
    baseSpec.assertProperty(createTestee(), ['pathString'], undefined, '/base/elements/e-image');
    baseSpec.assertProperty(createTestee(), ['isGlobal'], undefined, false);

    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });

    xdescribe('#constructor()', function()
    {
        it('should throw a exception when created without a Entity', function()
        {
            expect(function()
            {
                new EntityAspect();
            }).to.throw(MissingArgumentError);
        });

        it('should throw a exception when created without a proper Entity', function()
        {
            expect(function()
            {
                new EntityAspect('Category');
            }).to.throw(MissingArgumentError);
        });

        it('should throw a exception when created without a Site', function()
        {
            expect(function()
            {
                new EntityAspect(global.fixtures.entityImage);
            }).to.throw(MissingArgumentError);
        });

        it('should throw a exception when created without a proper Site', function()
        {
            expect(function()
            {
                new EntityAspect(global.fixtures.entityImage, 'Site');
            }).to.throw(TypeError);
        });
    });
});
