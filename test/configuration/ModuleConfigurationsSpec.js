'use strict';

/**
 * Requirements
 */
const ModuleConfigurations = require(ES_SOURCE + '/configuration/ModuleConfigurations.js')
    .ModuleConfigurations;
const baseMapSpec = require(ES_TEST + '/base/BaseMapShared.js').spec;

/**
 * Spec
 */
describe(ModuleConfigurations.className, function() {
    /**
     * BaseMap Test
     */
    baseMapSpec(ModuleConfigurations, 'configuration/ModuleConfigurations');
});
