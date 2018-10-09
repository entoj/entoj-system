'use strict';

/**
 * Requirements
 */
const EntityCategoryType = require(ES_SOURCE + '/model/entity/EntityCategoryType.js')
    .EntityCategoryType;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Spec
 */
describe(EntityCategoryType.className, function() {
    /**
     * Base Tests
     */
    baseSpec(EntityCategoryType, 'model.entity/EntityCategoryType');

    /**
     * ContentType Tests
     */
    baseSpec.assertProperty(EntityCategoryType, ['GLOBAL', 'PATTERN', 'PAGE', 'TEMPLATE']);
});
