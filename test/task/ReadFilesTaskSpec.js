'use strict';

/**
 * Requirements
 */
const ReadFilesTask = require(ES_SOURCE + '/task/ReadFilesTask.js').ReadFilesTask;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const taskSpec = require(ES_TEST + '/task/TaskShared.js').spec;
const pathes = require(ES_SOURCE + '/utils/pathes.js');
const co = require('co');

/**
 * Spec
 */
describe(ReadFilesTask.className, function() {
    /**
     * BaseTask Test
     */
    taskSpec(ReadFilesTask, 'task/ReadFilesTask', prepareParameters);

    /**
     */
    function prepareParameters(parameters) {
        parameters.unshift(global.fixtures.cliLogger);
        return parameters;
    }

    /**
     * WriteFilesTask Test
     */
    beforeEach(function() {
        global.fixtures.cliLogger = new CliLogger();
        global.fixtures.cliLogger.muted = true;
        global.fixtures.path = pathes.concat(ES_FIXTURES, '/files/**/*.js');
    });

    describe('#stream()', function() {
        it('should read files from the filesystem', function() {
            const promise = co(function*() {
                const testee = new ReadFilesTask(global.fixtures.cliLogger);
                const data = yield taskSpec.readStream(
                    testee.stream(undefined, undefined, { path: global.fixtures.path })
                );
                expect(data).to.have.length(2);
                for (const file of data) {
                    expect(file.path).to.endWith('.js');
                }
            });
            return promise;
        });
    });
});
