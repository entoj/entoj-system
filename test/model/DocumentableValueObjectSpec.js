'use strict';

/**
 * Requirements
 */
const DocumentableValueObject = require(ES_SOURCE + '/model/DocumentableValueObject.js').DocumentableValueObject;
const documentableValueObjectSpec = require('./DocumentableValueObjectShared.js').spec;


/**
 * Spec
 */
describe(DocumentableValueObject.className, function()
{
    /**
     * DocumentableValueObject Test
     */
    documentableValueObjectSpec(DocumentableValueObject, 'model/DocumentableValueObject');


    /**
     * DocumentableValueObject Local Test
     */
    describe('#uniqueId', function()
    {
        it('should return the object instance per default', function()
        {
            const testee = new DocumentableValueObject();
            expect(testee.uniqueId).to.be.equal(testee);
        });
    });


    describe('#isEqualTo', function()
    {
        it('should return false when both objects are not the same instance', function()
        {
            const testee = new DocumentableValueObject();
            const other = new DocumentableValueObject();
            expect(testee.isEqualTo(other)).to.be.not.ok;
        });
    });
});
