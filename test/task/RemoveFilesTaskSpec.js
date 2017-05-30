'use strict';

/**
 * Requirements
 */
const RemoveFilesTask = require(ES_SOURCE + '/task/RemoveFilesTask.js').RemoveFilesTask;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const transformingTaskSpec = require(ES_TEST + '/task/TransformingTaskShared.js').spec;
const pathes = require(ES_SOURCE + '/utils/pathes.js');
const co = require('co');
const VinylFile = require('vinyl');


/**
 * Spec
 */
describe(RemoveFilesTask.className, function()
{
    /**
     * TransformingTask Test
     */
    transformingTaskSpec(RemoveFilesTask, 'task/RemoveFilesTask', prepareParameters);

    /**
     */
    function prepareParameters(parameters)
    {
        parameters.unshift(global.fixtures.cliLogger);
        return parameters;
    }


    /**
     * RemoveFilesTask Test
     */
    beforeEach(function()
    {
        global.fixtures.cliLogger = new CliLogger();
        global.fixtures.cliLogger.muted = true;
        global.fixtures.path = pathes.concat(global.ES_FIXTURES, '/files/**/*.*');
    });


    describe('#processFile()', function()
    {
        it('should not remove any files without configuration', function()
        {
            const promise = co(function *()
            {
                const testee = new RemoveFilesTask(global.fixtures.cliLogger);
                const file = new VinylFile(
                    {
                        path: '/path/to/test.html',
                        contents: new Buffer('')
                    });
                const resultFile = yield testee.processFile(file);
                expect(resultFile.path).to.be.ok;
            });
            return promise;
        });

        it('should remove files based on a removeFiles regex configuration', function()
        {
            const promise = co(function *()
            {
                const testee = new RemoveFilesTask(global.fixtures.cliLogger);
                const parameters =
                {
                    removeFiles:
                    [
                        '(.*)\.html$'
                    ]
                };
                const file1 = new VinylFile(
                    {
                        path: '/path/to/test.html',
                        contents: new Buffer('')
                    });
                const file2 = new VinylFile(
                    {
                        path: 'test.j2',
                        contents: new Buffer('')
                    });
                const resultFile1 = yield testee.processFile(file1, undefined, parameters);
                expect(resultFile1).to.be.not.ok;
                const resultFile2 = yield testee.processFile(file2, undefined, parameters);
                expect(resultFile2).to.be.ok;
            });
            return promise;
        });
    });
});
