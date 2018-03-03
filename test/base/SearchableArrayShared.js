'use strict';

/**
 * Requirements
 * @ignore
 */
const baseArraySpec = require(ES_TEST + '/base/BaseArrayShared.js').spec;


/**
 * Shared SearchableArray spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * BaseArray Test
     */
    baseArraySpec(type, className, prepareParameters);


    /**
     * SearchableArray Test
     */
    const createTestee = function()
    {
        let parameters = [];
        if (prepareParameters)
        {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    describe('#findBy', function()
    {
        it('should find the first item that matches the query', function()
        {
            const testee = createTestee();
            const item1 = { name: 'Jeff', age: 10, male: true };
            const item2 = { name: 'Joe', age: 10, male: true };
            testee.push(item1, item2);
            expect(testee.findBy({ age: 10, name: 'Joe' })).to.be.equal(item2);
        });
    });

    describe('#filterBy', function()
    {
        it('should find all items that matches the query', function()
        {
            const testee = createTestee();
            const item1 = { name: 'Jeff', age: 10, male: true };
            const item2 = { name: 'Joe', age: 10, male: true };
            const item3 = { name: 'Jan', age: 9, male: true };
            testee.push(item1, item2, item3);
            expect(testee.filterBy({ age: 10 })).to.have.length(2);
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
