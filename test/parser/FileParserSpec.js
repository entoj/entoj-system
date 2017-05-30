'use strict';

/**
 * Requirements
 */
const FileParser = require(ES_SOURCE + '/parser/FileParser.js').FileParser;
const fileParserSpec = require(ES_TEST + '/parser/FileParserShared.js').spec;


/**
 * Spec
 */
describe(FileParser.className, function()
{
    /**
     * FileParser Fixture
     */
    const fixture =
    {
        root: ES_FIXTURES + PATH_SEPERATOR + 'files',
        glob: ['/mixed/*.js', '/js/*.js'],
        globCount: 2
    };

    /**
     * FileParser Test
     */
    fileParserSpec(FileParser, 'parser/FileParser', fixture);
});
