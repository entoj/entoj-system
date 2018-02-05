'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const assertParameter = require('../utils/assert.js').assertParameter;
const through2 = require('through2');
const VinylFile = require('vinyl');


/**
 * Base class for a stream based task system similar to gulp.
 * In fact gulp plugins are easy to integrate.
 *
 * @extends Base
 * @memberOf task
 */
class Task extends Base
{
    /**
     * A transforming task
     */
    static get TRANSFORM()
    {
        return 'transform';
    }


    /**
     * A generating task
     */
    static get GENERATE()
    {
        return 'generate';
    }


    /**
     * @param {cli.CliLogger} cliLogger
     */
    constructor(cliLogger)
    {
        super();

        //Check params
        assertParameter(this, 'cliLogger', cliLogger, true, CliLogger);

        // Assign options
        this._cliLogger = cliLogger;
        this._previousTask = false;
        this._nextTask = false;
        this._type = Task.GENERATE;
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [CliLogger] };
    }


    /**
     * @see Base#className
     */
    static get className()
    {
        return 'task/Task';
    }


    /**
     * @type cli.CliLogger
     */
    get cliLogger()
    {
        return this._cliLogger;
    }


    /**
     * The task type - can be one of
     * - Task.TRANSFORM
     * - Task.GENERATE
     *
     * @public
     * @type {String}
     */
    get type()
    {
        return this._type;
    }


    /**
     * References the next task in the chain
     * The last task in a chain will return false.
     *
     * @protected
     * @type {task.Task}
     */
    get nextTask()
    {
        return this._nextTask;
    }


    /**
     * References the prebous task in the chain
     * The first task in a chain will return false.
     *
     * @protected
     * @type {task.Task}
     */
    get previousTask()
    {
        return this._previousTask;
    }


    /**
     * Prepares the given parameters before running a task by making
     * sure defaults are set and all values are valid.
     *
     * @protected
     * @param {model.configuration.BuildConfiguration} buildConfiguration
     * @param {Object} parameters
     * @returns {Promise.<Object>}
     */
    prepareParameters(buildConfiguration, parameters)
    {
        return Promise.resolve(parameters || {});
    }


    /**
     * The streaming interface of the task.
     * If given a stream it should return a transforming stream that applies the tasks work to all files.
     * If given no stream it should generate a new stream and populate it with files.
     *
     * Keep in mind that most tasks only support transforming or generating and will throw errors if used incorrectly.
     *
     * @protected
     * @param {model.configuration.BuildConfiguration} buildConfiguration
     * @param {Object} parameters
     * @returns {Stream}
     */
    stream(stream, buildConfiguration, parameters)
    {
        if (!stream && this.type == Task.TRANSFORM)
        {
            throw new TypeError(this.className + '::stream - Transforming tasks need a source stream');
        }

        let resultStream = stream;
        if (!resultStream)
        {
            resultStream = through2(
                {
                    objectMode: true
                });
            // this helps testing when stream is not implemented
            resultStream.write(new VinylFile(
                {
                    path:'test',
                    contents: new Buffer('')
                }));
            resultStream.end();
        }
        return resultStream;
    }


    /**
     * Connects another task to this task so
     * that it will be executed after this task.
     * This will update nextTask abd previousTask.
     *
     * @param {task.Task} task
     * @returns {task.Task}
     */
    pipe(task)
    {
        this._nextTask = task;
        task._previousTask = this;
        return task;
    }


    /**
     * Runs the task chain by starting with
     * the root/first task. The returned Promise will be resolved
     * when all tasks have finished.
     *
     * @param {model.configuration.BuildConfiguration} buildConfiguration
     * @param {Object} parameters
     * @returns {Promise}
     */
    run(buildConfiguration, parameters)
    {
        // Part of a chain?
        if (this.previousTask)
        {
            return this.previousTask.run(buildConfiguration, parameters);
        }

        // Start the task
        const promise = new Promise((resolve) =>
        {
            const work = this.cliLogger.section('Running task ' + this.className);
            const result = [];
            let stream = this.stream(undefined, buildConfiguration, parameters);

            // Handle chain
            let currentTask = this.nextTask;
            while (currentTask)
            {
                stream = currentTask.stream(stream, buildConfiguration, parameters);
                currentTask = currentTask.nextTask;
            }

            // Collect result
            stream.on('data', (item) =>
            {
                result.push(item);
            });

            // Wait for stream end
            if (stream._readableState && stream._readableState.ended)
            {
                resolve(result);
            }
            else
            {
                stream.on('finish', () =>
                {
                    this.cliLogger.end(work);
                    resolve(result);
                });
            }
        });
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Task = Task;
