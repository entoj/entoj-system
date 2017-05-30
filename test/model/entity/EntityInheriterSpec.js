'use strict';

/**
 * Requirements
 */
const EntityInheriter = require(ES_SOURCE + '/model/entity/EntityInheriter.js').EntityInheriter;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(EntityInheriter.className, function()
{
    baseSpec(EntityInheriter, 'model.entity/EntityInheriter');
});
