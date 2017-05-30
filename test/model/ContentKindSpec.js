'use strict';

/**
 * Requirements
 */
const ContentKind = require(ES_SOURCE + '/model/ContentKind.js').ContentKind;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(ContentKind.className, function()
{
    /**
     * Base Tests
     */
    baseSpec(ContentKind, 'model/ContentKind');

    /**
     * ContentType Tests
     */
    baseSpec.assertProperty(ContentKind, ['UNKNOWN', 'CSS', 'JS', 'MACRO', 'EXAMPLE', 'DATAMODEL', 'TEXT']);
});
