'use strict';

/**
 * Requirements
 * @ignore
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');


/**
 * Shared Parser spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);


    /**
     * Parser Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic(true);
    });

    const createTestee = function()
    {
        let parameters = Array.from(arguments);
        if (prepareParameters)
        {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };


    describe('#parseMacro', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee();
            expect(testee.parseMacro()).to.be.instanceof(Promise);
        });
    });


    describe('#parseString', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee();
            expect(testee.parseString()).to.be.instanceof(Promise);
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
