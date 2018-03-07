'use strict';

/**
 * Requirements
 */
const EntityAspect = require(ES_SOURCE + '/model/entity/EntityAspect.js').EntityAspect;
const Site = require(ES_SOURCE + '/model/site/Site.js').Site;
const ContentKind = require(ES_SOURCE + '/model/ContentKind.js').ContentKind;
const valueObjectSpec = require('../ValueObjectShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const baseSpec = require('../../BaseShared.js').spec;
const co = require('co');


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
        global.fixtures = projectFixture.createDynamic();
    });

    describe('#hasOwnContentOfKind()', function()
    {
        it('should return true if the entity defines its own content for the given kind', function()
        {
            const promise = co(function*()
            {
                const entity = yield global.fixtures.entitiesRepository.getById('base/elements/e-cta');
                expect(entity.hasOwnContentOfKind(ContentKind.MACRO)).to.be.true;
            });
            return promise;
        });

        it('should return false if the entity does not define its own content for the given kind', function()
        {
            const promise = co(function*()
            {
                const entity = yield global.fixtures.entitiesRepository.getById('extended/elements/e-cta');
                expect(entity.hasOwnContentOfKind(ContentKind.MACRO)).to.be.false;
            });
            return promise;
        });

        it('should return true if the extended entity does define its own content for the given kind', function()
        {
            const promise = co(function*()
            {
                const entity = yield global.fixtures.entitiesRepository.getById('extended/elements/e-image');
                expect(entity.hasOwnContentOfKind(ContentKind.TEXT)).to.be.true;
            });
            return promise;
        });
    });
});
