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
        it('should allow to configure name, value and site', function()
        {
            const testee = new Translation({ name: 'key', value: 'Value', site: { name: 'Base' } });
            expect(testee.name).to.equal('key');
            expect(testee.value).to.equal('Value');
            expect(testee.site.name).to.equal('Base');
        });
    });


    describe('#dehydrate', function()
    {
        it('should allow to update value, name and site', function()
        {
            const data = new Translation({ name: 'key', value: 'initial', site: { name: 'Base' } });
            const testee = new Translation({ name: 'key', value: 'updated', site: { name: 'Extended' } });
            testee.dehydrate(data);
            expect(testee.name).to.be.equal(data.name);
            expect(testee.value).to.be.equal(data.value);
            expect(testee.site.name).to.equal(data.site.name);
        });
    });
});
