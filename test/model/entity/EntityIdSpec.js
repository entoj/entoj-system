/**
 * Requirements
 */
const EntityId = require(ES_SOURCE + '/model/entity/EntityId.js').EntityId;
const MissingArgumentError = require(ES_SOURCE + '/error/MissingArgumentError.js').MissingArgumentError;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');

/**
 * Spec
 */
describe(EntityId.className, function()
{
    /**
     * Base Test
     */
    baseSpec(EntityId, 'model.entity/EntityId', function(parameters)
    {
        parameters.unshift(global.fixtures.entityIdTemplate);
        parameters.unshift(undefined);
        parameters.unshift(undefined);
        parameters.unshift(undefined);
        parameters.unshift(global.fixtures.categoryElement);
        return parameters;
    });


    /**
     * EntityId Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });


    // Simple properties
    const createTestee = function()
    {
        /** @fix this is ugly af */
        global.fixtures = projectFixture.createStatic();
        return new EntityId(global.fixtures.categoryElement, 'Button', 1, global.fixtures.siteBase, global.fixtures.entityIdTemplate);
    };
    baseSpec.assertProperty(createTestee(), ['category'], global.fixtures.categoryElement);
    baseSpec.assertProperty(createTestee(), ['isGlobal'], undefined, false);
    baseSpec.assertProperty(createTestee(), ['number'], 2, 1);
    baseSpec.assertProperty(createTestee(), ['name'], 'Knopf', 'Button');
    baseSpec.assertProperty(createTestee(), ['idString'], undefined, 'e-button');
    baseSpec.assertProperty(createTestee(), ['pathString'], undefined, '/base/elements/e-button');

    describe('#constructor', function()
    {
        it('should throw a exception when created without a category', function()
        {
            expect(function()
            {
                new EntityId();
            }).to.throw(MissingArgumentError);
        });

        it('should throw a exception when created without a proper category type', function()
        {
            expect(function()
            {
                new EntityId('Category', 'Button');
            }).to.throw(TypeError);
        });

        it('should allow to configure category, name, number, site and template', function()
        {
            const testee = new EntityId(global.fixtures.categoryElement, 'Button', 1, global.fixtures.siteBase, global.fixtures.entityIdTemplate);
            expect(testee.category).to.equal(global.fixtures.categoryElement);
            expect(testee.name).to.equal('Button');
            expect(testee.number).to.equal(1);
            expect(testee.site).to.equal(global.fixtures.siteBase);
        });
    });


    describe('#isEqualTo', function()
    {
        it('should return true when both entityIds have the same value', function()
        {
            const testee = new EntityId(global.fixtures.categoryElement, 'Button', undefined, global.fixtures.siteBase, global.fixtures.entityIdTemplate);
            const other = new EntityId(global.fixtures.categoryElement, 'Button', undefined, global.fixtures.siteBase, global.fixtures.entityIdTemplate);
            expect(testee.isEqualTo(other)).to.be.ok;
        });

        it('should return false when both entityIds don´t have the same value', function()
        {
            const testee = new EntityId(global.fixtures.categoryElement, 'Button', undefined, global.fixtures.siteBase, global.fixtures.entityIdTemplate);
            const other = new EntityId(global.fixtures.categoryElement, 'Button', 1, global.fixtures.siteBase, global.fixtures.entityIdTemplate);
            expect(testee.isEqualTo(other)).to.be.not.ok;
        });

    });


    describe('#asString', function()
    {
        it('should return a id and path based on the configured templates', function()
        {
            const testee = new EntityId(global.fixtures.categoryElement, 'Button', 1, global.fixtures.siteBase, global.fixtures.entityIdTemplate);
            expect(testee.asString(EntityId.ID)).to.be.equal('e-button');
            expect(testee.asString(EntityId.PATH)).to.be.equal('/base/elements/e-button');
        });

        it('should use different templates for global categories', function()
        {
            const testee = new EntityId(global.fixtures.categoryGlobal, undefined, undefined, global.fixtures.siteBase, global.fixtures.entityIdTemplate);
            expect(testee.asString(EntityId.ID)).to.be.equal('global');
            expect(testee.asString(EntityId.PATH)).to.be.equal('/base/global');
        });
    });


    describe('#toString', function()
    {
        it('should return a string representation that reflects its state', function()
        {
            const testee = new EntityId(global.fixtures.categoryElement, 'Button', 1, global.fixtures.siteBase, global.fixtures.entityIdTemplate);
            expect(testee.toString()).to.be.equal('[model.entity/EntityId Element Button]');
        });
    });
});
