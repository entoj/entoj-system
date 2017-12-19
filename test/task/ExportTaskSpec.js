'use strict';

/**
 * Requirements
 */
const ExportTask = require(ES_SOURCE + '/task/ExportTask.js').ExportTask;
const Exporter = require(ES_SOURCE + '/export/Exporter.js').Exporter;
const JinjaParser = require(ES_SOURCE + '/export/parser/JinjaParser.js').JinjaParser;
const Renderer = require(ES_SOURCE + '/export/Renderer.js').Renderer;
const AnyNodeRenderer = require(ES_SOURCE + '/export/renderer/AnyNodeRenderer.js').AnyNodeRenderer;
const Transformer = require(ES_SOURCE + '/export/Transformer.js').Transformer;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const entitiesTaskSpec = require(ES_TEST + '/task/EntitiesTaskShared.js').spec;
const co = require('co');
const VinylFile = require('vinyl');
const sinon = require('sinon');


/**
 * Spec
 */
describe(ExportTask.className, function()
{
    /**
     * EntitiesTask Test
     */
    entitiesTaskSpec(ExportTask, 'task/ExportTask', function()
    {
        const fixture = projectFixture.createStatic();
        const parser = new JinjaParser();
        const renderer = new Renderer([new AnyNodeRenderer()]);
        const transformer = new Transformer();
        const exporter = new Exporter(fixture.globalRepository, fixture.buildConfiguration, parser, renderer, transformer);
        return [fixture.cliLogger, fixture.globalRepository, exporter];
    });


    /**
     * ExportTask Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createDynamic();
    });

    // creates a initialized testee
    const createTestee = function()
    {
        const parser = new JinjaParser();
        const renderer = new Renderer([new AnyNodeRenderer()]);
        const transformer = new Transformer();
        const exporter = new Exporter(global.fixtures.globalRepository, global.fixtures.buildConfiguration, parser, renderer, transformer);
        return new ExportTask(global.fixtures.cliLogger, global.fixtures.globalRepository, exporter);
    };

    describe('#renderEntity()', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee();
            const promise = testee.renderEntity();
            expect(promise).to.be.instanceof(Promise);
            return promise;
        });

        it('should use exporter.export', function()
        {
            const promise = co(function *()
            {
                const testee = createTestee();
                sinon.spy(testee.exporter, 'export');
                const entity = (yield global.fixtures.globalRepository.resolveEntities('base/modules/m-teaser')).pop();
                yield testee.renderEntity(entity);
                expect(testee.exporter.export.calledOnce).to.be.true;
            });
            return promise;
        });

        it('should yield a VinylFile', function()
        {
            const promise = co(function *()
            {
                const testee = createTestee();
                const entity = (yield global.fixtures.globalRepository.resolveEntities('base/modules/m-teaser')).pop();
                const files = yield testee.renderEntity(entity);
                const file = Array.isArray(files)
                    ? files[0]
                    : files;
                expect(file).to.be.instanceof(VinylFile);
                expect(file.contents.toString()).to.have.length.above(1);
            });
            return promise;
        });
    });


    describe('#processEntity()', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee();
            const promise = testee.processEntity();
            expect(promise).to.be.instanceof(Promise);
            return promise;
        });

        it('should call renderEntity for each export configuration', function()
        {
            const promise = co(function *()
            {
                const testee = createTestee();
                sinon.spy(testee, 'renderEntity');
                const entity = (yield global.fixtures.globalRepository.resolveEntities('base/modules/m-teaser')).pop();
                entity.properties.load({ export: { default: [{}, {}] }});
                yield testee.processEntity(entity);
                expect(testee.renderEntity.calledTwice).to.be.true;
            });
            return promise;
        });

        it('should yield a VinylFile for each export configuration', function()
        {
            const promise = co(function *()
            {
                const testee = createTestee();
                const entity = (yield global.fixtures.globalRepository.resolveEntities('base/modules/m-teaser')).pop();
                entity.properties.load({ export: { default: [{}, {}] }});
                const files = yield testee.processEntity(entity);
                expect(files).to.be.instanceof(Array);
                expect(files).to.have.length(2);
            });
            return promise;
        });
    });
});
