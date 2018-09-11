'use strict';

/**
 * Requirements
 */
const DocumentationExample = require(ES_SOURCE + '/model/documentation/DocumentationExample.js')
    .DocumentationExample;
const ContentKind = require(ES_SOURCE + '/model/ContentKind.js').ContentKind;
const documentationSpec = require('./DocumentationShared.js').spec;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Spec
 */
describe(DocumentationExample.className, function() {
    /**
     * Documentation Test
     */
    documentationSpec(DocumentationExample, 'model.documentation/DocumentationExample');

    /**
     * DocumentationExample Test
     */
    baseSpec.assertProperty(
        new DocumentationExample(),
        ['contentKind'],
        ContentKind.UNKNOWN,
        ContentKind.EXAMPLE
    );
});
