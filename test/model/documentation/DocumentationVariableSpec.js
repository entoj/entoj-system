'use strict';

/**
 * Requirements
 */
const DocumentationVariable = require(ES_SOURCE + '/model/documentation/DocumentationVariable.js').DocumentationVariable;
const documentationVariableSpec = require('./DocumentationVariableShared.js').spec;


/**
 * Spec
 */
describe(DocumentationVariable.className, function()
{
    /**
     * DocumentationVariable Test
     */
    documentationVariableSpec(DocumentationVariable, 'model.documentation/DocumentationVariable');
});
