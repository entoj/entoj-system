'use strict';

/**
 * Requirements
 * @ignore
 */
const Task = require('./Task.js').Task;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const through2 = require('through2');
const co = require('co');


/**
 * @memberOf task
 */
class WrappingTask extends Task
{
    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [CliLogger] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'task/WrappingTask';
    }


    /**
     * @inheritDoc
     */
    get sectionName()
    {
        return 'Running wrapped tasks';
    }


    /**
     * @protected
     * @returns {Promise<Array>}
     */
    prepareParameters(buildConfiguration, parameters)
    {
        const promise = super.prepareParameters(buildConfiguration, parameters)
            .then((params) =>
            {
                params.query = params.query || '*';
                return params;
            });
        return promise;
    }


    /**
     * @inheritDoc
     * @returns {Promise<Array>}
     */
    prepare(buildConfiguration, parameters)
    {
        return Promise.resolve([]);
    }


    /**
     * @inheritDoc
     * @returns {Promise<Array>}
     */
    runTasks(buildConfiguration, parameters)
    {
        return Promise.resolve([]);
    }


    /**
     * @inheritDoc
     * @returns {Promise<Array>}
     */
    finalize(buildConfiguration, parameters)
    {
        return Promise.resolve([]);
    }


    /**
     * @returns {Stream}
     */
    stream(stream, buildConfiguration, parameters)
    {
        let resultStream = stream;
        if (!resultStream)
        {
            resultStream = through2(
                {
                    objectMode: true
                });
            const scope = this;
            co(function *()
            {
                const work = scope.cliLogger.section(scope.sectionName);
                const params = yield scope.prepareParameters(buildConfiguration, parameters);
                scope.cliLogger.options(params);
                const preparedFiles = yield scope.prepare(buildConfiguration, params);
                for (const file of preparedFiles)
                {
                    resultStream.write(file);
                }
                const files = yield scope.runTasks(buildConfiguration, params);
                for (const file of files)
                {
                    resultStream.write(file);
                }
                const finalizedFiles = yield scope.finalize(buildConfiguration, params);
                for (const file of finalizedFiles)
                {
                    resultStream.write(file);
                }
                resultStream.end();
                scope.cliLogger.end(work);
            }).catch(ErrorHandler.handler(scope));
        }
        return resultStream;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.WrappingTask = WrappingTask;
