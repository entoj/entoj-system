'use strict';

/**
 * Requirements
 */
const EnvironmentTask = require(ES_SOURCE + '/task/EnvironmentTask.js').EnvironmentTask;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const transformingTaskSpec = require(ES_TEST + '/task/TransformingTaskShared.js').spec;
const co = require('co');
const VinylFile = require('vinyl');



/**
 * Spec
 */
describe(EnvironmentTask.className, function()
{
    /**
     * TransformingTask Test
     */
    transformingTaskSpec(EnvironmentTask, 'task/EnvironmentTask', prepareParameters);

    /**
     */
    function prepareParameters(parameters)
    {
        parameters.unshift(global.fixtures.cliLogger);
        return parameters;
    }


    /**
     * EnvironmentTask Test
     */
    beforeEach(function()
    {
        global.fixtures.cliLogger = new CliLogger();
        global.fixtures.cliLogger.muted = true;
    });


    describe('#processFile()', function()
    {
        it('should activate environments', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    environment: 'production'
                };
                const fileData = 'All/* +environment: development */-Development/* -environment *//* +environment: production */-Production/* -environment */';
                const file = new VinylFile({ path: '/tmp/template.css', contents: new Buffer(fileData)});
                const testee = new EnvironmentTask(global.fixtures.cliLogger);
                const data = yield testee.processFile(file, undefined, options);
                expect(data).to.be.instanceof(VinylFile);
                expect(data.contents.toString()).to.be.equal('All-Production');
            });
            return promise;
        });

        it('should allow to skip activating environments for file types', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    environmentSkipFiles: ['.css'],
                    environment: 'production'
                };
                const fileData = 'All/* +environment: development */-Development/* -environment *//* +environment: production */-Production/* -environment */';
                const file = new VinylFile({ path: '/tmp/template.css', contents: new Buffer(fileData)});
                const testee = new EnvironmentTask(global.fixtures.cliLogger);
                const data = yield testee.processFile(file, undefined, options);
                expect(data).to.be.instanceof(VinylFile);
                expect(data.contents.toString()).to.be.equal(fileData);
            });
            return promise;
        });

        it('should allow to disable environments', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    environment: 'production',
                    environmentEnabled: false
                };
                const fileData = 'All/* +environment: development */-Development/* -environment *//* +environment: production */-Production/* -environment */';
                const file = new VinylFile({ path: '/tmp/template.css', contents: new Buffer(fileData)});
                const testee = new EnvironmentTask(global.fixtures.cliLogger);
                const data = yield testee.processFile(file, undefined, options);
                expect(data).to.be.instanceof(VinylFile);
                expect(data.contents.toString()).to.be.equal(fileData);
            });
            return promise;
        });
    });
});
