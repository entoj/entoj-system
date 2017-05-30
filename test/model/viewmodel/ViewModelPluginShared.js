'use strict';

/**
 * Requirements
 * @ignore
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Shared ViewModelPlugin spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);


    /**
     * ViewModelPlugin Test
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


    describe('#execute', function()
    {
        it('should return a promise', function()
        {
            const testee = new createTestee();
            const promise = testee.execute();
            expect(promise).to.be.instanceof(Promise);
            return promise;
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
