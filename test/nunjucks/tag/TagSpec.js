'use strict';

/**
 * Requirements
 */
const Tag = require(ES_SOURCE + '/nunjucks/tag/Tag.js').Tag;
const tagSpec = require(ES_TEST + '/nunjucks/tag/TagShared.js').spec;

/**
 * Spec
 */
describe(Tag.className, function() {
    /**
     * Tag Test
     */
    tagSpec(Tag, 'nunjucks.tag/Tag');
});
