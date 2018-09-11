'use strict';

/**
 * Requirements
 */
const DocumentationCode = require(ES_SOURCE + '/model/documentation/DocumentationCode.js')
    .DocumentationCode;
const documentationCodeSpec = require('./DocumentationCodeShared.js').spec;

/**
 * Spec
 */
describe(DocumentationCode.className, function() {
    /**
     * DocumentationCode Test
     */
    documentationCodeSpec(DocumentationCode, 'model.documentation/DocumentationCode');
});
