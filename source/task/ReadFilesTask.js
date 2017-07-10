'use strict';

/**
 * Requirements
 * @ignore
 */
const Task = require('./Task.js').Task;
const gulp = require('gulp');
const Stream = require('stream');
const VinylFile = require('vinyl');
const synchronize = require('../utils/synchronize.js');
const PATH_SEPERATOR = require('path').sep;


/**
 * @memberOf task
 * @extends task.Task
 */
class ReadFilesTask extends Task
{
    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'task/ReadFilesTask';
    }


    /**
     * @inheritDocs
     */
    prepareParameters(buildConfiguration, parameters)
    {
        const promise = super.prepareParameters(buildConfiguration, parameters)
            .then((params) =>
            {
                params.readPath = params.readPath || params.path || false;
                params.readPathBase = params.readPathBase || false;
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
        if (!params || !params.readPath)
        {
            return super.stream(stream, buildConfiguration, parameters);
        }

        const section = this.cliLogger.section('Reading files from <' + params.readPath + '>');
        const resultStream = new Stream.Transform({ objectMode: true });
        resultStream._transform = (file, encoding, callback) =>
        {
            const filePath = params.readPathBase
                ? file.path.replace(params.readPathBase + PATH_SEPERATOR, '')
                : file.path;
            if (filePath != '')
            {
                const resultFile = new VinylFile(
                    {
                        path: filePath,
                        contents: file.contents
                    });

                const work = this.cliLogger.work('Reading file <' + file.path + '>');
                resultStream.push(resultFile);
                this.cliLogger.end(work);
            }
            callback();
        };

        // Wait for stream
        resultStream.on('finish', () =>
        {
            this.cliLogger.end(section);
        });

        return gulp.src(params.readPath).pipe(resultStream);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ReadFilesTask = ReadFilesTask;
