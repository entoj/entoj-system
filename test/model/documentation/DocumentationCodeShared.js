'use strict';

/**
 * Requirements
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const documentationSpec = require('./DocumentationShared.js').spec;

/**
 * Shared DocumentationCode Spec
 */
function spec(type, className, prepareParameters) {
    /**
     * Documentation Test
     */
    documentationSpec(type, className, prepareParameters);

    /**
     * DocumentationCode Test
     */
    const createTestee = function() {
        let parameters = Array.from(arguments);
        if (prepareParameters) {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    // Simple properties
    baseSpec.assertProperty(createTestee(), ['namespace'], 'de.entoj', '');
    baseSpec.assertProperty(createTestee(), ['visibility'], 'private', 'public');
}

/**
 * Exports
 */
module.exports.spec = spec;
