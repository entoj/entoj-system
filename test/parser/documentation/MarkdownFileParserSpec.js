'use strict';

/**
 * Requirements
 */
const MarkdownFileParser = require(ES_SOURCE + '/parser/documentation/MarkdownFileParser.js')
    .MarkdownFileParser;
const fileParserSpec = require(ES_TEST + '/parser/FileParserShared.js').spec;

/**
 * Spec
 */
describe(MarkdownFileParser.className, function() {
    /**
     * MarkdownFileLinter Fixture
     */
    const fixture = {
        root: ES_FIXTURES + PATH_SEPERATOR + 'files',
        glob: ['/mixed/*.md', '/md/*.md'],
        globCount: 2
    };

    /**
     * FileLinter Test
     */
    fileParserSpec(MarkdownFileParser, 'parser.documentation/MarkdownFileParser', fixture);
});
