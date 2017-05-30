'use strict';

/**
 * Requirements
 * @ignore
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Shared Parser spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * Base Test
     */
    baseSpec(type, className);

    /**
     * Parser Test
     */
    const createTestee = function()
    {
        let parameters = Array.from(arguments);
        if (prepareParameters)
        {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    describe('#parse()', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee();
            const promise = testee.parse();
            expect(promise).to.be.instanceof(Promise);
            return promise;
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
