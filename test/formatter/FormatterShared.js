'use strict';

/**
 * Requirements
 * @ignore
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Shared Formatter spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);

    /**
     * Route Tests
     */

    // create a testee
    const createTestee = function()
    {
        let parameters = Array.from(arguments);
        if (prepareParameters)
        {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    describe('#format', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee();
            expect(testee.format()).to.be.instanceof(Promise);
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
