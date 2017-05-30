'use strict';

/**
 * Requirements
 * @ignore
 */
const TransformingTask = require('./TransformingTask.js').TransformingTask;
const co = require('co');
const VinylFile = require('vinyl');


/**
 * @memberOf task
 * @extends task.SimpleTask
 */
class RenameFilesTask extends TransformingTask
{
    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'task/RenameFilesTask';
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
                params.removeFiles = params.renameFiles || [];
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

            // Rename file?
            let path = file.path;
            for (const find in params.renameFiles)
            {
                const regex = new RegExp(find, 'gi');
                const value = parameters.renameFiles[find];
                path = path.replace(regex, value);
            }
            if (path && path !== file.path)
            {
                const work = scope._cliLogger.work('Renamed file <' + file.path + '> to <' + path + '>');
                scope._cliLogger.end(work);
                return new VinylFile({ path: path, contents: file.contents });
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
module.exports.RenameFilesTask = RenameFilesTask;
