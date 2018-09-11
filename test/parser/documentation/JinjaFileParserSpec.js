'use strict';

/**
 * Requirements
 */
const JinjaFileParser = require(ES_SOURCE + '/parser/documentation/JinjaFileParser.js')
    .JinjaFileParser;
const fileParserSpec = require(ES_TEST + '/parser/FileParserShared.js').spec;

/**
 * Spec
 */
describe(JinjaFileParser.className, function() {
    /**
     * FileParser Fixture
     */
    const fixture = {
        root: ES_FIXTURES + PATH_SEPERATOR + 'files',
        glob: ['/mixed/*.j2', '/j2/*.j2'],
        globCount: 2
    };

    /**
     * FileParser Test
     */
    fileParserSpec(JinjaFileParser, 'parser.documentation/JinjaFileParser', fixture);
});
