'use strict';

/**
 * Requirements
 * @ignore
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const Environment = require('nunjucks').Environment;


/**
 * Shared Filter spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);

    /**
     * Filter Test
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


    describe('#register()', function()
    {
        it('should do nothing if not given a environment', function()
        {
            const testee = createTestee();
            testee.register();
            expect(testee.environment).to.be.not.ok;
        });


        it('should register the filter on the given environment', function()
        {
            const testee = createTestee();
            const environment = new Environment();
            testee.register(environment);
            expect(testee.environment).to.be.equal(environment);
            for (const name of testee.name)
            {
                expect(environment.getFilter(name)).to.be.ok;
            }
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
