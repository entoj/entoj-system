'use strict';

/**
 * Requirements
 */
const BaseMap = require(ES_SOURCE + '/base/BaseMap.js').BaseMap;
const baseMapSpec = require(ES_TEST + '/base/BaseMapShared.js').spec;

/**
 * Spec
 */
describe(BaseMap.className, function() {
    /**
     * BaseMap Test
     */
    baseMapSpec(BaseMap, 'base/BaseMap');
});
