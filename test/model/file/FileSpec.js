'use strict';

/**
 * Requirements
 */
const File = require(ES_SOURCE + '/model/file/File.js').File;
const ContentType = require(ES_SOURCE + '/model/ContentType.js').ContentType;
const ContentKind = require(ES_SOURCE + '/model/ContentKind.js').ContentKind;
const Site = require(ES_SOURCE + '/model/site/Site.js').Site;
const PATH_SEPERATOR = require('path').sep;
const isWin32 = (process.platform == 'win32');
const baseSpec = require('../../BaseShared.js').spec;
const valueObjectSpec = require('../ValueObjectShared.js').spec;


/**
 * Spec
 */
describe(File.className, function()
{
    /**
     * Base Test
     */
    valueObjectSpec(File, 'model.file/File');


    /**
     * File Test
     */

    // Simple properties
    baseSpec.assertProperty(new File({ filename: '/tmp/file.ext' }), ['site'], new Site('test'), undefined);
    baseSpec.assertProperty(new File({ filename: '/tmp/file.ext' }), ['contentType'], ContentType.SASS, undefined);
    baseSpec.assertProperty(new File({ filename: '/tmp/file.ext' }), ['contentKind'], ContentKind.CSS, undefined);
    baseSpec.assertProperty(new File({ filename: '/tmp/file.ext' }), ['basename', 'path', 'extension']);

    describe('#contentKind', function()
    {
        it('should have ContentKind.UNKNOWN as a default', function()
        {
            const testee = new File();
            expect(testee.contentKind).to.equal(ContentKind.UNKNOWN);
        });


        it('should allow to set a content kind', function()
        {
            const testee = new File();
            testee.contentKind = ContentKind.EXAMPLE;
            expect(testee.contentKind).to.equal(ContentKind.EXAMPLE);
        });
    });


    describe('#contentType', function()
    {
        it('should have ContentType.ANY as a default', function()
        {
            const testee = new File();
            expect(testee.contentType).to.equal(ContentType.ANY);
        });


        it('should allow to set a content type', function()
        {
            const testee = new File();
            testee.contentType = ContentType.JINJA;
            expect(testee.contentType).to.equal(ContentType.JINJA);
        });
    });


    describe('#filename', function()
    {
        it('should allow to get & set a filename', function()
        {
            const testee = new File();
            testee.filename = '/tmp/file/name.ext';
            expect(testee.filename).to.endWith(PATH_SEPERATOR + 'tmp' + PATH_SEPERATOR + 'file' + PATH_SEPERATOR + 'name.ext');
        });

        if (isWin32)
        {
            it('should allow to get & set a windows filename', function()
            {
                const testee = new File();
                testee.filename = 'C:\\tmp\\file\\name.ext';
                expect(testee.filename).to.endWith(PATH_SEPERATOR + 'tmp' + PATH_SEPERATOR + 'file' + PATH_SEPERATOR + 'name.ext');
            });
        }
    });


    describe('#contents', function()
    {
        it('should allow to get & set the file contents', function()
        {
            const testee = new File();
            testee.contents = 'Content';
            expect(testee.contents).to.be.equal('Content');
        });

        it('should read file contents when not explicitly set', function()
        {
            const testee = new File();
            testee.filename = __filename;
            expect(testee.contents).to.have.string('File.className');
        });
    });


    describe('#path', function()
    {
        it('should allow to get the path of filename', function()
        {
            const testee = new File({ filename: '/tmp/file/name.ext' });
            expect(testee.path).to.endWith(PATH_SEPERATOR + 'tmp' + PATH_SEPERATOR + 'file');
        });
    });


    describe('#basename', function()
    {
        it('should allow to get the basename of filename', function()
        {
            const testee = new File({ filename: '/tmp/file/name.ext' });
            expect(testee.basename).to.be.equal('name.ext');
        });
    });


    describe('#extension', function()
    {
        it('should allow to get the extension of filename', function()
        {
            const testee = new File({ filename: '/tmp/file/name.ext' });
            expect(testee.extension).to.be.equal('.ext');
        });
    });
});
