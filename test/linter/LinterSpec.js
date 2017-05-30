'use strict';

/**
 * Requirements
 */
const Linter = require(ES_SOURCE + '/linter/Linter.js').Linter;
const linterSpec = require(ES_TEST + '/linter/LinterShared.js').spec;


/**
 * Spec
 */
describe(Linter.className, function()
{
    /**
     * BaseLinter Test
     */
    linterSpec(Linter, 'linter/Linter');
});
