'use strict';

/**
 * Requirements
 */
const EntityCategory = require(ES_SOURCE + '/model/entity/EntityCategory.js').EntityCategory;
const EntityCategoryType = require(ES_SOURCE + '/model/entity/EntityCategoryType.js').EntityCategoryType;
const documentableValueObjectSpec = require('../DocumentableValueObjectShared.js').spec;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(EntityCategory.className, function()
{
    /**
     * DocumentableValueObject Test
     */
    documentableValueObjectSpec(EntityCategory, 'model.entity/EntityCategory', function(parameters)
    {
        parameters.unshift('base');
        return parameters;
    });


    /**
     * EntityCategory Test
     */
    baseSpec.assertProperty(EntityCategory, ['LONG_NAME', 'SHORT_NAME', 'PLURAL_NAME', 'ANY']);

    describe('#constructor()', function()
    {
        it('should allow to configure shortName, longName, pluralName and type', function()
        {
            const testee = new EntityCategory({ longName: 'Module', pluralName: 'Modules', shortName: 'm', type: EntityCategoryType.GLOBAL });

            expect(testee.longName).to.equal('Module');
            expect(testee.pluralName).to.equal('Modules');
            expect(testee.shortName).to.equal('m');
            expect(testee.type).to.equal(EntityCategoryType.GLOBAL);
            expect(testee.isGlobal).to.ok;
        });

        it('should derive short from long name if not given', function()
        {
            const testee = new EntityCategory({ longName: 'Element' });

            expect(testee.shortName).to.equal('e');
        });

        it('should derive plural from long name if not given', function()
        {
            const testee = new EntityCategory({ longName: 'Element' });

            expect(testee.pluralName).to.equal('Elements');
        });

        it('should use PATTERN as the default type', function()
        {
            const testee = new EntityCategory({ longName: 'Element' });

            expect(testee.type).to.equal(EntityCategoryType.PATTERN);
        });

        it('should allow to use the deprecated isGlobal configuration', function()
        {
            const testee = new EntityCategory({ longName: 'Element', isGlobal: true });

            expect(testee.type).to.equal(EntityCategoryType.GLOBAL);
        });

        it('should automatically assign GLOBAL type to a category named Global', function()
        {
            const testee = new EntityCategory({ longName: 'Global' });

            expect(testee.type).to.equal(EntityCategoryType.GLOBAL);
        });

        it('should automatically assign PAGE type to a category named Page', function()
        {
            const testee = new EntityCategory({ longName: 'Page' });

            expect(testee.type).to.equal(EntityCategoryType.PAGE);
        });

        it('should automatically assign TEMPLATE type to a category named Template', function()
        {
            const testee = new EntityCategory({ longName: 'Template' });

            expect(testee.type).to.equal(EntityCategoryType.TEMPLATE);
        });
    });


    describe('#dehydrate', function()
    {
        it('should allow to update longName, pluralName, shortName and isGlobal', function()
        {
            const data = new EntityCategory({ longName: 'Element' });
            const testee = new EntityCategory({ longName: 'Module' });
            testee.dehydrate(data);
            expect(testee.longName).to.be.equal(data.longName);
            expect(testee.pluralName).to.be.equal(data.pluralName);
            expect(testee.shortName).to.be.equal(data.shortName);
            expect(testee.isGlobal).to.be.equal(data.isGlobal);
        });
    });
});
