'use strict';

/**
 * Requirements
 * @ignore
 */
const TransformingTask = require('./TransformingTask.js').TransformingTask;
const VinylFile = require('vinyl');
const co = require('co');
const path = require('path');
const activateEnvironment = require('../utils/string.js').activateEnvironment;


/**
 * Activates environment specific code
 *
 * @memberOf task
 */
class EnvironmentTask extends TransformingTask
{
    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'task/EnvironmentTask';
    }


    /**
     * @inheritDocs
     */
    get sectionName()
    {
        return 'Activating environment configurations';
    }


    /**
     * @inheritDocs
     */
    prepareParameters(buildConfiguration, parameters)
    {
        const promise = super.prepareParameters(buildConfiguration, parameters)
            .then((params) =>
            {
                params.environment = params.environment || '';
                params.environmentSkipFiles = params.environmentSkipFiles || [];
                params.environmentEnabled = (typeof params.environmentEnabled !== 'undefined')
                    ? params.environmentEnabled === true
                    : true;
                return params;
            });
        return promise;
    }


    /**
     * @inheritDocs
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
                scope.cliLogger.info('Invalid file <' + file + '>');
                return false;
            }

            // Skip?
            if (!params.environmentEnabled || params.environmentSkipFiles.indexOf(path.extname(file.path)) > -1)
            {
                const work = scope.cliLogger.work('Skip file <' + file.path + '>');
                scope.cliLogger.end(work);
                return file;
            }

            // Activate environment configs
            const work = scope.cliLogger.work('Activating environment on file <' + file.path + '>');
            const contents = activateEnvironment(file.contents.toString(), params.environment);
            const resultFile = new VinylFile({ path: file.path, contents: new Buffer(contents) });
            scope.cliLogger.end(work);

            return resultFile;
        });
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EnvironmentTask = EnvironmentTask;
