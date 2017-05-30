'use strict';

/**
 * Requirements
 */
const TemplateTask = require(ES_SOURCE + '/task/TemplateTask.js').TemplateTask;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const transformingTaskSpec = require(ES_TEST + '/task/TransformingTaskShared.js').spec;
const VinylFile = require('vinyl');
const co = require('co');


/**
 * Spec
 */
describe(TemplateTask.className, function()
{
    /**
     * TransformingTask Test
     */
    transformingTaskSpec(TemplateTask, 'task/TemplateTask', prepareParameters);

    /**
     */
    function prepareParameters(parameters)
    {
        parameters.unshift(global.fixtures.cliLogger);
        return parameters;
    }


    /**
     * TemplateTask Test
     */
    beforeEach(function()
    {
        global.fixtures.cliLogger = new CliLogger();
        global.fixtures.cliLogger.muted = true;
    });


    describe('#processFile()', function()
    {
        it('should process files as templates', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    templateData:
                    {
                        data: 'test'
                    }
                };
                const fileData = '<$ data $>';
                const file = new VinylFile({ path: '/tmp/template.css', contents: new Buffer(fileData)});
                const testee = new TemplateTask(global.fixtures.cliLogger);
                const data = yield testee.processFile(file, undefined, options);
                expect(data).to.be.instanceof(VinylFile);
                expect(data.contents.toString()).to.be.equal('test');
            });
            return promise;
        });

        it('should allow to autoescape variables', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    templateAutoescape: true,
                    templateData:
                    {
                        data: 'test<a>link</a>'
                    }
                };
                const fileData = '<$ data $>';
                const file = new VinylFile({ path: '/tmp/template.css', contents: new Buffer(fileData)});
                const testee = new TemplateTask(global.fixtures.cliLogger);
                const data = yield testee.processFile(file, undefined, options);
                expect(data).to.be.instanceof(VinylFile);
                expect(data.contents.toString()).to.be.equal('test&lt;a&gt;link&lt;/a&gt;');
            });
            return promise;
        });

        it('should allow to skip processing file types as templates', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    templateSkipFiles: ['.css'],
                    templateData:
                    {
                        data: 'test'
                    }
                };
                const fileData = '<$ data $>';
                const file = new VinylFile({ path: '/tmp/template.css', contents: new Buffer(fileData)});
                const testee = new TemplateTask(global.fixtures.cliLogger);
                const data = yield testee.processFile(file, undefined, options);
                expect(data).to.be.instanceof(VinylFile);
                expect(data.contents.toString()).to.be.equal(fileData);
            });
            return promise;
        });
    });
});
