'use strict';

/**
 * Requirements
 */
const RenameFilesTask = require(ES_SOURCE + '/task/RenameFilesTask.js').RenameFilesTask;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const transformingTaskSpec = require(ES_TEST + '/task/TransformingTaskShared.js').spec;
const pathes = require(ES_SOURCE + '/utils/pathes.js');
const co = require('co');
const VinylFile = require('vinyl');


/**
 * Spec
 */
describe(RenameFilesTask.className, function()
{
    /**
     * TransformingTask Test
     */
    transformingTaskSpec(RenameFilesTask, 'task/RenameFilesTask', prepareParameters);

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
        global.fixtures.path = pathes.concat(global.ES_FIXTURES, '/files/**/*.*');
    });


    describe('#processFile()', function()
    {
        it('should not rename any files without configuration', function()
        {
            const promise = co(function *()
            {
                const testee = new RenameFilesTask(global.fixtures.cliLogger);
                const file = new VinylFile(
                    {
                        path: PATH_SEPERATOR + 'path' + PATH_SEPERATOR + 'to' + PATH_SEPERATOR + 'test.html',
                        contents: new Buffer('')
                    });
                const resultFile = yield testee.processFile(file);
                expect(resultFile.path).to.be.equal(file.path);
            });
            return promise;
        });

        it('should rename files based on a renameFiles regex configuration', function()
        {
            const promise = co(function *()
            {
                const testee = new RenameFilesTask(global.fixtures.cliLogger);
                const parameters =
                {
                    renameFiles:
                    {
                        '(.*)\.html$': '$1.txt',
                        '(.*)test\.(.*)': '$1example.$2'
                    }
                };
                const file1 = new VinylFile(
                    {
                        path: PATH_SEPERATOR + 'path' + PATH_SEPERATOR + 'to' + PATH_SEPERATOR + 'test.html',
                        contents: new Buffer('')
                    });
                const file2 = new VinylFile(
                    {
                        path: 'test.html',
                        contents: new Buffer('')
                    });
                const resultFile1 = yield testee.processFile(file1, undefined, parameters);
                expect(resultFile1.path).to.be.equal(PATH_SEPERATOR + 'path' + PATH_SEPERATOR + 'to' + PATH_SEPERATOR + 'example.txt');
                const resultFile2 = yield testee.processFile(file2, undefined, parameters);
                expect(resultFile2.path).to.be.equal('example.txt');
            });
            return promise;
        });
    });
});
