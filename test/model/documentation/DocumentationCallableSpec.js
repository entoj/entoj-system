'use strict';

/**
 * Requirements
 */
const DocumentationCallable = require(ES_SOURCE + '/model/documentation/DocumentationCallable.js').DocumentationCallable;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const documentationCodeSpec = require('./DocumentationCodeShared.js').spec;


/**
 * Spec
 */
describe(DocumentationCallable.className, function()
{
    /**
     * DocumentationCode Test
     */
    documentationCodeSpec(DocumentationCallable, 'model.documentation/DocumentationCallable');

    /**
     * DocumentationCallable Test
     */
    baseSpec.assertProperty(new DocumentationCallable(), ['dependencies'], ['hey'], []);
    baseSpec.assertProperty(new DocumentationCallable(), ['parameters'], ['hey'], []);
    baseSpec.assertProperty(new DocumentationCallable(), ['returns'], 'void');
});
