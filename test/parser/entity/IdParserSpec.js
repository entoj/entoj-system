'use strict';

/**
 * Requirements
 */
const IdParser = require(ES_SOURCE + '/parser/entity/IdParser.js').IdParser;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(IdParser.className, function()
{
    /**
     * Base Test
     */
    baseSpec(IdParser, 'parser.entity/IdParser');
});
