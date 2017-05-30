'use strict';

/**
 * Requirements
 */
const Parser = require(ES_SOURCE + '/parser/Parser.js').Parser;
const parserSpec = require('./ParserShared.js').spec;


/**
 * Spec
 */
describe(Parser.className, function()
{
    /**
     * Parser Test
     */
    parserSpec(Parser, 'parser/Parser');
});
