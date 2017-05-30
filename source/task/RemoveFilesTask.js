'use strict';

/**
 * Requirements
 * @ignore
 */
const TransformingTask = require('./TransformingTask.js').TransformingTask;
const co = require('co');


/**
 * @memberOf task
 * @extends task.SimpleTask
 */
class RemoveFilesTask extends TransformingTask
{
    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'task/RemoveFilesTask';
    }


    /**
     * @protected
     * @returns {Array}
     */
    prepareParameters(buildConfiguration, parameters)
    {
        const promise = super.prepareParameters(buildConfiguration, parameters)
            .then((params) =>
            {
                params.removeFiles = params.removeFiles || [];
                return params;
            });
        return promise;
    }


    /**
     * @param {VinylFile} file
     * @param {model.configuration.BuildConfiguration} buildConfiguration
     * @param {Object} parameters
     * @returns {Promise<VinylFile>}
     */
    processFile(file, buildConfiguration, parameters)
    {
        const scope = this;
        const promise = co(function*()
        {
            // Prepare
            const params = yield scope.prepareParameters(buildConfiguration, parameters);

            /* istanbul ignore next */
            if (!file || !file.isNull)
            {
                scope._cliLogger.info('Invalid file <' + file + '>');
                return false;
            }

            // Remove file?
            for (const remove of params.removeFiles)
            {
                if (file.path.match(new RegExp(remove)))
                {
                    const work = scope._cliLogger.work('Removing file <' + file.path + '>');
                    scope._cliLogger.end(work);
                    return false;
                }
            }

            return file;
        });
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.RemoveFilesTask = RemoveFilesTask;
