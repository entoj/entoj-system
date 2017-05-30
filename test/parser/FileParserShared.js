'use strict';

/**
 * Requirements
 * @ignore
 */
const ContentType = require(ES_SOURCE + '/model/ContentType.js').ContentType;
const ContentKind = require(ES_SOURCE + '/model/ContentKind.js').ContentKind;
const parserSpec = require(ES_TEST + '/parser/ParserShared.js').spec;
const co = require('co');
const sinon = require('sinon');


/**
 * Shared FileParser spec
 */
function spec(type, className, fixture, prepareParameters)
{
    /**
     * Parser Test
     */
    parserSpec(type, className, prepareParameters);


    /**
     * FileParser Test
     */
    const createTestee = function()
    {
        let parameters = Array.from(arguments);
        if (prepareParameters)
        {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };


    describe('#constructor', function()
    {
        it('should allow to configure glob, fileContent and fileType via options', function()
        {
            const options =
            {
                glob: fixture.glob,
                fileType: ContentType.SASS,
                fileKind: ContentKind.CSS
            };
            const testee = createTestee(options);
            expect(testee.glob).to.contain(options.glob[0]);
            expect(testee.fileType).to.be.equal(ContentType.SASS);
            expect(testee.fileKind).to.be.equal(ContentKind.CSS);
        });
    });


    describe('#parse', function()
    {
        it('should resolve to an object containing all parsed files', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    glob: fixture.glob
                };
                const testee = createTestee(options);
                const result = yield testee.parse(fixture.root);
                expect(result).to.be.ok;
                expect(result.files).to.have.length(fixture.globCount);
            });
            return promise;
        });

        it('should parse each file that is matched by the given glob and root path', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    glob: fixture.glob
                };
                const testee = createTestee(options);
                sinon.spy(testee, 'parseFile');
                yield testee.parse(fixture.root);
                expect(testee.parseFile.callCount).to.be.equal(fixture.globCount);
            });
            return promise;
        });

        it('should invoke the parser for each file that is matched by the given glob and root path', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    glob: fixture.glob
                };
                const testee = createTestee(options);
                sinon.spy(testee.parser, 'parse');
                yield testee.parse(fixture.root);
                expect(testee.parser.parse.callCount).to.be.equal(fixture.globCount);
            });
            return promise;
        });

        it('should allow to override the glob per parse call', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    glob: fixture.glob
                };
                const testee = createTestee();
                sinon.spy(testee, 'parseFile');
                yield testee.parse(fixture.root, options);
                expect(testee.parseFile.callCount).to.be.equal(fixture.globCount);
            });
            return promise;
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
