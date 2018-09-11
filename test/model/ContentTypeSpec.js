'use strict';

/**
 * Requirements
 */
const ContentType = require(ES_SOURCE + '/model/ContentType.js').ContentType;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Spec
 */
describe(ContentType.className, function() {
    /**
     * Base Tests
     */
    baseSpec(ContentType, 'model/ContentType');

    /**
     * ContentType Tests
     */
    baseSpec.assertProperty(ContentType, ['ANY', 'SASS', 'JS', 'JSON', 'JINJA', 'MARKDOWN']);
});
