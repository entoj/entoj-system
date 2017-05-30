/**
 * Requirements
 */
const ParserPlugin = require(ES_SOURCE + '/model/loader/documentation/ParserPlugin.js').ParserPlugin;
const Parser = require(ES_SOURCE + '/parser/Parser.js').Parser;
const MissingArgumentError = require(ES_SOURCE + '/error/MissingArgumentError.js').MissingArgumentError;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const loaderPluginSpec = require('../LoaderPluginShared.js').spec;
const sinon = require('sinon');


/**
 * Spec
 */
describe(ParserPlugin.className, function()
{
    /**
     * LoaderPlugin Test
     */
    loaderPluginSpec(ParserPlugin, 'model.loader.documentation/ParserPlugin', function(params)
    {
        params.unshift(global.fixtures.pathesConfiguration);
        return params;
    });


    /**
     * ParserPlugin Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });

    describe('#constructor()', function()
    {
        it('should throw a exception when created without a pathes configuration', function()
        {
            expect(function()
            {
                new ParserPlugin();
            }).to.throw(MissingArgumentError);
        });

        it('should throw a exception when created without a proper pathes type', function()
        {
            expect(function()
            {
                new ParserPlugin('Pathes');
            }).to.throw(TypeError);
        });
    });


    describe('#executeFor()', function()
    {
        it('should throw when no entity given', function()
        {
            expect(function()
            {
                const testee = new ParserPlugin(global.fixtures.pathesConfiguration);
                testee.parser = new Parser();
                testee.executeFor();
            }).to.throw(MissingArgumentError);
        });


        it('should throw when wrong item type given', function()
        {
            expect(function()
            {
                const testee = new ParserPlugin(global.fixtures.pathesConfiguration);
                testee.parser = new Parser();
                testee.executeFor('wat');
            }).to.throw(TypeError);
        });


        it('should throw when wrong site type given', function()
        {
            expect(function()
            {
                const testee = new ParserPlugin(global.fixtures.pathesConfiguration);
                testee.parser = new Parser();
                testee.executeFor(global.fixtures.entityTeaser, 'site');
            }).to.throw(TypeError);
        });


        it('should execute the parser', function()
        {
            const testee = new ParserPlugin(global.fixtures.pathesConfiguration);
            testee.parser = new Parser();
            sinon.spy(testee.parser, 'parse');
            const promise = testee.executeFor(global.fixtures.entityTeaser).then(function()
            {
                expect(testee.parser.parse.calledOnce).to.be.ok;
            });
            return promise;
        });


        it('should add the parsed files and documentation to the given item', function()
        {
            const testee = new ParserPlugin(global.fixtures.pathesConfiguration);
            testee.parser = new Parser();
            sinon.stub(testee.parser, 'parse').returns({ files:[{}], items:[{}] });
            global.fixtures.entityTeaser.files.clear();
            global.fixtures.entityTeaser.documentation.clear();
            const promise = testee.executeFor(global.fixtures.entityTeaser).then(function()
            {
                expect(global.fixtures.entityTeaser.files).to.have.length(1);
                expect(global.fixtures.entityTeaser.documentation).to.have.length(1);
            });
            return promise;
        });


        it('should allow to parse a item of a specific site', function()
        {
            const testee = new ParserPlugin(global.fixtures.pathesConfiguration);
            testee.parser = new Parser();
            sinon.stub(testee.parser, 'parse').returns({ files:[{}], items:[{}] });
            global.fixtures.entityImage.files.clear();
            global.fixtures.entityImage.documentation.clear();
            const promise = testee.executeFor(global.fixtures.entityImage, global.fixtures.siteExtended).then(function()
            {
                expect(global.fixtures.entityImage.files[0].site).to.be.equal(global.fixtures.siteExtended);
                expect(global.fixtures.entityImage.documentation[0].site).to.be.equal(global.fixtures.siteExtended);
            });
            return promise;
        });


        it('should update the site property of all parsed items', function()
        {
            const testee = new ParserPlugin(global.fixtures.pathesConfiguration);
            testee.parser = new Parser();
            sinon.stub(testee.parser, 'parse').returns({ files:[{}], items:[{}] });
            global.fixtures.entityTeaser.files.clear();
            global.fixtures.entityTeaser.documentation.clear();
            const promise = testee.executeFor(global.fixtures.entityTeaser).then(function()
            {
                expect(global.fixtures.entityTeaser.files[0].site).to.be.equal(global.fixtures.siteBase);
                expect(global.fixtures.entityTeaser.documentation[0].site).to.be.equal(global.fixtures.entityTeaser.id.site);
            });
            return promise;
        });
    });
});
