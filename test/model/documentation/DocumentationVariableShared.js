'use strict';

/**
 * Requirements
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const documentationCodeSpec = require('./DocumentationCodeShared.js').spec;

/**
 * Shared DocumentationVariable Spec
 */
function spec(type, className, prepareParameters) {
    /**
     * DocumentationCode Test
     */
    documentationCodeSpec(type, className, prepareParameters);

    /**
     * DocumentationVariable Test
     */
    const createTestee = function() {
        let parameters = Array.from(arguments);
        if (prepareParameters) {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    // Simple properties
    baseSpec.assertProperty(createTestee(), ['type'], ['hey'], []);
    baseSpec.assertProperty(createTestee(), ['enumeration'], []);
    baseSpec.assertProperty(createTestee(), ['value'], '*');
}

/**
 * Exports
 */
module.exports.spec = spec;
