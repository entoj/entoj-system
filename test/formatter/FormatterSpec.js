'use strict';

/**
 * Requirements
 */
const Formatter = require(ES_SOURCE + '/formatter/Formatter.js').Formatter;
const formatterSpec = require('./FormatterShared.js').spec;


/**
 * Spec
 */
describe(Formatter.className, function()
{
    /**
     * Formatter Test
     */
    formatterSpec(Formatter, 'formatter/Formatter');
});
