'use strict';

/**
 * Requirements
 */
const matchValue = require(ES_SOURCE + '/utils/match.js').matchValue;
const matchObject = require(ES_SOURCE + '/utils/match.js').matchObject;


/**
 * Spec
 */
describe('utils/match', function()
{
    describe('#matchValue()', function()
    {
        it('should allow to match a scalar', function()
        {
            expect(matchValue(1, 2)).to.be.not.ok;
            expect(matchValue(1, 1)).to.be.ok;
            expect(matchValue('yo', 'yo')).to.be.ok;
        });

        it('should ignore case when matching strings', function()
        {
            expect(matchValue('yo', 'Yo')).to.be.ok;
        });

        it('should allow to match by a regex', function()
        {
            expect(matchValue('yo', /y/)).to.be.ok;
        });

        it('should allow to match by a isEqualTo method', function()
        {
            expect(matchValue({ isEqualTo: () => true }, 'yo')).to.be.ok;
        });
    });


    describe('#matchObject()', function()
    {
        it('should match when all tests match', function()
        {
            const testee =
            {
                name: 'Test',
                age: 10
            };
            expect(matchObject(testee, { name: 'Test' })).to.be.ok;
            expect(matchObject(testee, { name: 'Test', age: 10 })).to.be.ok;
        });

        it('should not match when at least one test fails', function()
        {
            const testee =
            {
                name: 'Test',
                age: 10
            };
            expect(matchObject(testee, { name: 'Test', age: 11 })).to.be.not.ok;
        });
    });
});
