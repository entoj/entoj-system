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
    baseSpec.assertProperty(Translation, ['SITE', 'ANY']);

    describe('#constructor()', function()
    {
        it('should allow to configure data and site', function()
        {
            const testee = new Translation({ data: 'data', site: { name: 'Base' } });
            expect(testee.data).to.equal('data');
            expect(testee.site.name).to.equal('Base');
        });
    });


    describe('#dehydrate', function()
    {
        it('should allow to update data and site', function()
        {
            const data = new Translation({ data: 'augmented', site: { name: 'Base' } });
            const testee = new Translation({ data: 'data', site: { name: 'Extended' } });
            testee.dehydrate(data);
            expect(testee.data).to.be.equal(data.data);
            expect(testee.site.name).to.equal(data.site.name);
        });
    });
});
