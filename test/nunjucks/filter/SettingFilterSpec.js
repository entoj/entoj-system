'use strict';

/**
 * Requirements
 */
const SettingFilter = require(ES_SOURCE + '/nunjucks/filter/SettingFilter.js').SettingFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;


/**
 * Spec
 */
describe(SettingFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(SettingFilter, 'nunjucks.filter/SettingFilter');


    /**
     * SettingFilter Test
     */
    describe('#filter()', function()
    {
        it('should return a empty object for a unknown setting', function()
        {
            const testee = new SettingFilter().filter();
            expect(testee()).to.be.deep.equal({});
            expect(testee('not.there')).to.be.deep.equal({});
        });

        it('should return a existing setting when key is the value', function()
        {
            const testee = new SettingFilter({ foo: 'bar' }).filter();
            expect(testee('foo')).to.be.equal('bar');
        });

        it('should return a existing setting when key is the first parameter', function()
        {
            const testee = new SettingFilter({ foo: 'bar' }).filter();
            expect(testee(false, 'foo')).to.be.equal('bar');
        });
    });
});
