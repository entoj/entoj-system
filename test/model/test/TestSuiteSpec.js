'use strict';

/**
 * Requirements
 */
const TestSuite = require(ES_SOURCE + '/model/test/TestSuite.js').TestSuite;
const testSuiteSpec = require('./TestSuiteShared.js').spec;

/**
 * Spec
 */
describe(TestSuite.className, function() {
    /**
     * Test TestSuite
     */
    testSuiteSpec(TestSuite, 'model.test/TestSuite');
});
