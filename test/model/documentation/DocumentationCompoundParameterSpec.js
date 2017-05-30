'use strict';

/**
 * Requirements
 */
const DocumentationCompoundParameter = require(ES_SOURCE + '/model/documentation/DocumentationCompoundParameter.js').DocumentationCompoundParameter;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const documentationParameterSpec = require('./DocumentationParameterShared.js').spec;


/**
 * Spec
 */
describe(DocumentationCompoundParameter.className, function()
{
    /**
     * DocumentationParameter Test
     */
    documentationParameterSpec(DocumentationCompoundParameter, 'model.documentation/DocumentationCompoundParameter');

    /**
     * DocumentationCompoundParameter Test
     */
    baseSpec.assertProperty(new DocumentationCompoundParameter(), ['children'], ['hey'], []);
});
