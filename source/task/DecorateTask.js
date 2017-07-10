'use strict';

/**
 * Requirements
 * @ignore
 */
const TransformingTask = require('./TransformingTask.js').TransformingTask;
const VinylFile = require('vinyl');
const templateString = require('es6-template-strings');
const co = require('co');
const path = require('path');


/**
 * Adds configurable banners to the top and bottom of files
 *
 * @memberOf task
 * @extends task.TransformingTask
 * @taskParameter {Array} [decorateVariables] - The variables that are usable within templates
 * @taskParameter {String} [decorateAppend] - The template used at the bottom of each file
 * @taskParameter {String} [decorateAppend] - The template used at the bottom of each file
 */
class DecorateTask extends TransformingTask
{
    /**
     * @see Base.className
     */
    static get className()
    {
        return 'task/DecorateTask';
    }


    /**
     * @inheritDoc
     */
    get sectionName()
    {
        return 'Decorating files';
    }


    /**
     * @inheritDocs
     */
    prepareParameters(buildConfiguration, parameters)
    {
        const promise = super.prepareParameters(buildConfiguration, parameters)
            .then((params) =>
            {
                params.decorateVariables = params.decorateVariables || {};
                params.decoratePrepend = params.decoratePrepend || '';
                params.decorateAppend = params.decorateAppend || '';
                params.decorateSkipFiles = params.decorateSkipFiles || [];
                params.decorateEnabled = (typeof params.decorateEnabled !== 'undefined')
                    ? params.decorateEnabled === true
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
            if (!params.decorateEnabled || params.decorateSkipFiles.indexOf(path.extname(file.path)) > -1)
            {
                const work = scope.cliLogger.work('Skip file <' + file.path + '>');
                scope.cliLogger.end(work);
                return file;
            }

            // Add templates to top & bottom of files
            const work = scope.cliLogger.work('Adding banner to file <' + file.path + '>');
            const prepend = templateString(params.decoratePrepend, params.decorateVariables);
            const append = templateString(params.decorateAppend, params.decorateVariables);
            const contents = new Buffer(prepend + file.contents.toString() + append);
            const resultFile = new VinylFile({ path: file.path, contents: contents });
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
module.exports.DecorateTask = DecorateTask;
