'use strict';

/**
 * Requirements
 * @ignore
 */
const TransformingTask = require('./TransformingTask.js').TransformingTask;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const VinylFile = require('vinyl');
const path = require('path');
const Environment = require('nunjucks').Environment;
const co = require('co');


/**
 * @memberOf task
 * @extends task.SimpleTask
 */
class TemplateTask extends TransformingTask
{
    /**
     * @ignore
     */
    constructor(cliLogger)
    {
        super(cliLogger);
        this._nunjucks = new Environment(undefined,
            {
                autoescape: false,
                throwOnUndefined: false,
                tags:
                {
                    blockStart: '<%',
                    blockEnd: '%>',
                    variableStart: '<$',
                    variableEnd: '$>',
                    commentStart: '<#',
                    commentEnd: '#>'
                }
            });
    }


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
        return 'task/TemplateTask';
    }


    /**
     * @returns {String}
     */
    get sectionName()
    {
        return 'Processing templates';
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
                params.templateSkipFiles = params.templateSkipFiles || ['.png', '.jpg', '.gif'];
                params.templateData = params.templateData || {};
                params.templateAutoescape = params.templateAutoescape || false;
                return params;
            });
        return promise;
    }


    /**
     * @returns {Stream}
     */
    processFile(file, buildConfiguration, parameters)
    {
        const scope = this;
        const promise = co(function*()
        {
            // Prepare
            const params = yield scope.prepareParameters(buildConfiguration, parameters);
            scope._nunjucks.opts.autoescape = params.templateAutoescape;

            /* istanbul ignore next */
            if (!file || !file.isNull)
            {
                scope.cliLogger.info('Invalid file <' + file + '>');
                return false;
            }

            // Check skip files
            if (params.templateSkipFiles.indexOf(path.extname(file.path)) > -1)
            {
                const work = scope.cliLogger.work('Skip file <' + file.path + '>');
                scope.cliLogger.end(work);
                return file;
            }

            // Render template
            const work = scope.cliLogger.work('Rendering template file <' + file.path + '>');
            let resultFile;
            try
            {
                const contents = scope._nunjucks.renderString(file.contents.toString(), params.templateData);
                resultFile = new VinylFile(
                    {
                        path: file.path,
                        contents: new Buffer(contents)
                    });
            }
            catch(e)
            {
                /* istanbul ignore next */
                scope.cliLogger.error(e);
            }
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
module.exports.TemplateTask = TemplateTask;
