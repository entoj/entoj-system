'use strict';

/**
 * Requirements
 */
const Base = require(ES_SOURCE + '/Base.js').Base;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(Base.className, function()
{
    baseSpec(Base, 'Base');
});
