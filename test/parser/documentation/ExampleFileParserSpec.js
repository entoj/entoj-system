'use strict';

/**
 * Requirements
 */
const ExampleFileParser = require(ES_SOURCE + '/parser/documentation/ExampleFileParser.js').ExampleFileParser;
const fileParserSpec = require(ES_TEST + '/parser/FileParserShared.js').spec;


/**
 * Spec
 */
describe(ExampleFileParser.className, function()
{
    /**
     * ExampleFileParser Fixture
     */
    const fixture =
    {
        root: ES_FIXTURES + PATH_SEPERATOR + 'files',
        glob: ['/mixed/*.j2', '/j2/*.j2'],
        globCount: 2
    };


    /**
     * FileParser Test
     */
    fileParserSpec(ExampleFileParser, 'parser.documentation/ExampleFileParser', fixture);
});
