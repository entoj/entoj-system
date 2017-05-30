'use strict';

/**
 * Requirements
 * @ignore
 */
const baseSpec = require('../../BaseShared.js').spec;


/**
 * Shared Test spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);


    /**
     * Test Test
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

    // Simple properties
    baseSpec.assertProperty(createTestee(), ['name'], 'Name', '');
    baseSpec.assertProperty(createTestee(), ['ok'], 10, 0);
    baseSpec.assertProperty(createTestee(), ['failed'], 1, 0);
    baseSpec.assertProperty(createTestee(), ['tests'], ['test'], []);
    baseSpec.assertProperty(createTestee(), ['site'], 'Site', false);
}

/**
 * Exports
 */
module.exports = spec;
module.exports.spec = spec;
