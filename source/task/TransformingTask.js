'use strict';

/**
 * Requirements
 * @ignore
 */
const Task = require('./Task.js').Task;
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

        const section = this._cliLogger.section(this.sectionName);

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

        // Wait for stream
        resultStream.on('finish', () =>
        {
            this._cliLogger.end(section);
        });

        return stream.pipe(resultStream);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.TransformingTask = TransformingTask;
