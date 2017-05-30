'use strict';

/**
 * Requirements
 */
const EntityCategory = require(ES_SOURCE + '/model/entity/EntityCategory.js').EntityCategory;
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
        it('should allow to configure shortName, longName, pluralName and isGlobal', function()
        {
            const testee = new EntityCategory({ longName: 'Module', pluralName: 'Modules', shortName: 'm', isGlobal: true });

            expect(testee.longName).to.equal('Module');
            expect(testee.pluralName).to.equal('Modules');
            expect(testee.shortName).to.equal('m');
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
