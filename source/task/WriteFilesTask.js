'use strict';

/**
 * Requirements
 * @ignore
 */
const Task = require('./Task.js').Task;
const gulp = require('gulp');
const synchronize = require('../utils/synchronize.js');


/**
 * @memberOf task
 * @extends task.Task
 */
class WriteFilesTask extends Task
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'task/WriteFilesTask';
    }


    /**
     * @inheritDoc
     */
    prepareParameters(buildConfiguration, parameters)
    {
        const promise = super.prepareParameters(buildConfiguration, parameters)
            .then((params) =>
            {
                params.writePath = params.writePath || params.path || false;
                return params;
            });
        return promise;
    }


    /**
     * @returns {Stream}
     */
    stream(stream, buildConfiguration, parameters)
    {
        const params = synchronize.execute(this, 'prepareParameters', [buildConfiguration, parameters]);
        if (!params || !params.writePath)
        {
            return super.stream(stream, buildConfiguration, parameters);
        }

        const work = this.cliLogger.section('Writing files to filesystem at <' + params.writePath + '>');
        const resultStream = stream.pipe(gulp.dest(params.writePath));
        resultStream.on('finish', () =>
        {
            this.cliLogger.end(work);
        });

        return resultStream;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.WriteFilesTask = WriteFilesTask;
