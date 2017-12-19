'use strict';

/**
 * Requirements
 */
const Translation = require(ES_SOURCE + '/model/translation/Translation.js').Translation;
const valueObjectSpec = require('../ValueObjectShared.js').spec;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(Translation.className, function()
{
    /**
     * ValueObject Test
     */
    valueObjectSpec(Translation, 'model.translation/Translation');


    /**
     * Translation Test
     */
    baseSpec.assertProperty(Translation, ['NAME', 'ANY']);

    describe('#constructor()', function()
    {
        it('should allow to configure name and value', function()
        {
            const testee = new Translation({ name: 'key', value: 'Value' });
            expect(testee.name).to.equal('key');
            expect(testee.value).to.equal('Value');
        });
    });


    describe('#dehydrate', function()
    {
        it('should allow to update value and name', function()
        {
            const data = new Translation({ name: 'key', value: 'initial' });
            const testee = new Translation({ name: 'key', value: 'updated' });
            testee.dehydrate(data);
            expect(testee.name).to.be.equal(data.name);
            expect(testee.value).to.be.equal(data.value);
        });
    });
});
