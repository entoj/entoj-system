'use strict';

/**
 * Requirements
 * @ignore
 */
const Task = require('./Task.js').Task;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const Stream = require('stream');


/**
 * @memberOf task
 * @extends task.Task
 */
class TransformingTask extends Task
{
    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [CliLogger] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'task/TransformingTask';
    }


    /**
     * The section name is used for logging when the task is started
     *
     * @type {String}
     */
    get sectionName()
    {
        return 'TransformingTask';
    }


    /**
     * @inheritDoc
     * @returns {void}
     */
    prepare(buildConfiguration, parameters)
    {
    }


    /**
     * @inheritDoc
     * @returns {void}
     */
    finalize(buildConfiguration, parameters)
    {
    }


    /**
     * Allows to make last minute additions to the underlying stream.
     *
     * @param {Stream} strem
     * @returns {Promise}
     */
    flush(stream)
    {
        return Promise.resolve();
    }


    /**
     * Applies the tasks work on a file. This is calles for each
     * file in the stream.
     *
     * @param {VinylFile} file
     * @param {model.configuration.BuildConfiguration} buildConfiguration
     * @param {Object} parameters
     * @returns {Promise<VinylFile>}
     */
    processFile(file, buildConfiguration, parameters)
    {
        return Promise.resolve(file);
    }


    /**
     * @inheritDocs
     */
    stream(stream, buildConfiguration, parameters)
    {
        if (!stream)
        {
            return super.stream(stream, buildConfiguration, parameters);
        }
        const section = this.cliLogger.section(this.sectionName);
        this.prepare(buildConfiguration, parameters);

        // Render stream
        const resultStream = new Stream.Transform({ objectMode: true });
        resultStream._transform = (file, encoding, callback) =>
        {
            this.processFile(file, buildConfiguration, parameters)
                .then((resultFile) =>
                {
                    if (resultFile)
                    {
                        resultStream.push(resultFile);
                    }
                    callback();
                })
                .catch((error) =>
                {
                    /* istanbul ignore next */
                    this.logger.error(error);
                    /* istanbul ignore next */
                    callback();
                });
        };
        resultStream._flush = (callback) =>
        {
            this.flush(resultStream).then(callback);
        };

        // Wait for stream
        resultStream.on('finish', () =>
        {
            this.finalize(buildConfiguration, parameters);
            this.cliLogger.end(section);
        });

        return stream.pipe(resultStream);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.TransformingTask = TransformingTask;
