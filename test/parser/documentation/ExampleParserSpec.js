/**
 * Requirements
 */
const ExampleParser = require(ES_SOURCE + '/parser/documentation/ExampleParser.js').ExampleParser;
const DocumentationExample = require(ES_SOURCE + '/model/documentation/DocumentationExample.js').DocumentationExample;
const ContentType = require(ES_SOURCE + '/model/ContentType.js').ContentType;
const parserSpec = require(ES_TEST + '/parser/ParserShared.js').spec;


/**
 * Spec
 */
describe(ExampleParser.className, function()
{
    /**
     * Parser Test
     */
    parserSpec(ExampleParser, 'parser.documentation/ExampleParser');


    /**
     * ExampleParser Test
     */
    describe('#parse()', function()
    {
        it('should always resolve to a DocumentationExample', function()
        {
            const testee = new ExampleParser();
            const docblock = ' ';

            const promise = testee.parse(docblock, { contentType: ContentType.JS }).then(function(documentation)
            {
                expect(documentation).to.be.instanceof(DocumentationExample);
            });
            return promise;
        });

        it('should support /** .. */ docblocks', function()
        {
            const testee = new ExampleParser();
            const docblock = `
            /**
              *  Example
              */
            {% macro one(name, id) %}`;

            const promise = testee.parse(docblock, { contentType: ContentType.JS }).then(function(documentation)
            {
                expect(documentation.description).to.contain('Example');
            });
            return promise;
        });

        it('should support {## .. #} docblocks', function()
        {
            const testee = new ExampleParser();
            const docblock = `
            {##
                Example
             #}
            {% macro one(name, id) %}`;

            const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
            {
                expect(documentation.description).to.contain('Example');
            });
            return promise;
        });

        it('should parse only the first docblock', function()
        {
            const testee = new ExampleParser();
            const docblock = `
            {##
                First
             #}
            {##
                Example
             #}
            {% macro one(name, id) %}`;

            const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
            {
                expect(documentation.description).to.contain('First');
            });
            return promise;
        });
    });
});
