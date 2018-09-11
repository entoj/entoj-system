'use strict';

/**
 * Requirements
 */
const Parser = require(ES_SOURCE + '/export/Parser.js').Parser;
const parserSpec = require('./ParserShared.js').spec;

/**
 * Spec
 */
describe(Parser.className, function() {
    /**
     * Parser Test
     */
    parserSpec(Parser, 'export/Parser');
});
