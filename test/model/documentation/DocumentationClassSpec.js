'use strict';

/**
 * Requirements
 */
const DocumentationClass = require(ES_SOURCE + '/model/documentation/DocumentationClass.js')
    .DocumentationClass;
const documentationCodeSpec = require('./DocumentationCodeShared.js').spec;

/**
 * Spec
 */
describe(DocumentationClass.className, function() {
    /**
     * DocumentationCode Test
     */
    documentationCodeSpec(DocumentationClass, 'model.documentation/DocumentationClass');
});
