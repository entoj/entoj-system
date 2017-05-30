'use strict';

/**
 * Requirements
 */
const WriteFilesTask = require(ES_SOURCE + '/task/WriteFilesTask.js').WriteFilesTask;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const taskSpec = require(ES_TEST + '/task/TaskShared.js').spec;
const pathes = require(ES_SOURCE + '/utils/pathes.js');
const through2 = require('through2');
const VinylFile = require('vinyl');
const fs = require('fs-extra');


/**
 * Spec
 */
describe(WriteFilesTask.className, function()
{
    /**
     * BaseTask Test
     */
    taskSpec(WriteFilesTask, 'task/WriteFilesTask', prepareParameters);

    /**
     */
    function prepareParameters(parameters)
    {
        parameters.unshift(global.fixtures.cliLogger);
        return parameters;
    }


    /**
     * WriteFilesTask Test
     */
    beforeEach(function()
    {
        global.fixtures.cliLogger = new CliLogger();
        global.fixtures.cliLogger.muted = true;
        global.fixtures.path = pathes.concat(global.ES_FIXTURES, '/temp');
        fs.emptyDirSync(global.fixtures.path);
    });


    describe('#stream()', function()
    {
        it('should write files to the filesystem', function(cb)
        {
            const sourceStream = through2(
                {
                    objectMode: true
                });
            sourceStream.write(new VinylFile(
                {
                    path: 'test.css',
                    contents: new Buffer('test')
                }));
            sourceStream.end();

            const testee = new WriteFilesTask(global.fixtures.cliLogger);
            testee.stream(sourceStream, undefined, { path: global.fixtures.path })
                .on('finish', () =>
                {
                    expect(fs.existsSync(pathes.concat(global.fixtures.path, 'test.css'))).to.be.ok;
                    cb();
                });
        });
    });
});
