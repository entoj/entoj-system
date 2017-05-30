'use strict';

/**
 * Requirements
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const documentationVariableSpec = require('./DocumentationVariableShared.js').spec;


/**
 * Shared DocumentationParameter Spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * DocumentationVariable Test
     */
    documentationVariableSpec(type, className, prepareParameters);


    /**
     * DocumentationParameter Test
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
    baseSpec.assertProperty(createTestee(), ['defaultValue'], '*');
    baseSpec.assertProperty(createTestee(), ['isOptional'], true, false);

}

/**
 * Exports
 */
module.exports.spec = spec;
