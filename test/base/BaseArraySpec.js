'use strict';

/**
 * Requirements
 */
const BaseArray = require(ES_SOURCE + '/base/BaseArray.js').BaseArray;
const baseArraySpec = require(ES_TEST + '/base/BaseArrayShared.js').spec;

/**
 * Spec
 */
describe(BaseArray.className, function() {
    /**
     * BaseArray Test
     */
    baseArraySpec(BaseArray, 'base/BaseArray');
});
