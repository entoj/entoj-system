'use strict';

/**
 * Requirements
 */
const DocumentationParameter = require(ES_SOURCE + '/model/documentation/DocumentationParameter.js')
    .DocumentationParameter;
const documentationParameterSpec = require('./DocumentationParameterShared.js').spec;

/**
 * Spec
 */
describe(DocumentationParameter.className, function() {
    /**
     * DocumentationParameter Test
     */
    documentationParameterSpec(
        DocumentationParameter,
        'model.documentation/DocumentationParameter'
    );
});
