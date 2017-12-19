'use strict';

/**
 * Requirements
 */
const Setting = require(ES_SOURCE + '/model/setting/Setting.js').Setting;
const valueObjectSpec = require('../ValueObjectShared.js').spec;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(Setting.className, function()
{
    /**
     * ValueObject Test
     */
    valueObjectSpec(Setting, 'model.setting/Setting');


    /**
     * Setting Test
     */
    baseSpec.assertProperty(Setting, ['NAME', 'ANY']);

    describe('#constructor()', function()
    {
        it('should allow to configure name and value', function()
        {
            const testee = new Setting({ name: 'key', value: 'Value' });
            expect(testee.name).to.equal('key');
            expect(testee.value).to.equal('Value');
        });
    });


    describe('#dehydrate', function()
    {
        it('should allow to update value and name', function()
        {
            const data = new Setting({ name: 'key', value: 'initial' });
            const testee = new Setting({ name: 'key', value: 'updated' });
            testee.dehydrate(data);
            expect(testee.name).to.be.equal(data.name);
            expect(testee.value).to.be.equal(data.value);
        });
    });
});
