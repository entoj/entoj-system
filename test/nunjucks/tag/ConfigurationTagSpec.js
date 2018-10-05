'use strict';

/**
 * Requirements
 */
const ConfigurationTag = require(ES_SOURCE + '/nunjucks/tag/ConfigurationTag.js').ConfigurationTag;
const tagSpec = require(ES_TEST + '/nunjucks/tag/TagShared.js').spec;

/**
 * Spec
 */
describe(ConfigurationTag.className, function() {
    /**
     * Tag Test
     */
    tagSpec(ConfigurationTag, 'nunjucks.tag/ConfigurationTag');
});
