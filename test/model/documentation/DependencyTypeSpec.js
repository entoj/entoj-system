'use strict';

/**
 * Requirements
 */
const DependencyType = require(ES_SOURCE + '/model/documentation/DependencyType.js').DependencyType;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(DependencyType.className, function()
{
    /**
     * Base Tests
     */
    baseSpec(DependencyType, 'model.documentation/DependencyType');

    /**
     * DependencyType Tests
     */
    baseSpec.assertProperty(DependencyType, ['UNKNOWN', 'MACRO', 'TEMPLATE']);
});
