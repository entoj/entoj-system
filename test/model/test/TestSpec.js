'use strict';

/**
 * Requirements
 */
const Test = require(ES_SOURCE + '/model/test/Test.js').Test;
const testSpec = require('./TestShared.js').spec;


/**
 * Spec
 */
describe(Test.className, function()
{
    /**
     * Test Test
     */
    testSpec(Test, 'model.test/Test');
});
