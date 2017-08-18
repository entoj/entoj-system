'use strict';

/**
 * Requirements
 * @ignore
 */
const Command = require('./Command.js').Command;
const Base = require('../Base.js').Base;
const Task = require('../task/Task.js').Task;
const Context = require('../application/Context.js').Context;
const WriteFilesTask = require('../task/WriteFilesTask.js').WriteFilesTask;
const DecorateTask = require('../task/DecorateTask.js').DecorateTask;
const PathesConfiguration = require('../model/configuration/PathesConfiguration.js').PathesConfiguration;
const BuildConfiguration = require('../model/configuration/BuildConfiguration.js').BuildConfiguration;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const co = require('co');
const gitRev = require('git-rev-promises');


/**
 * @memberOf command
 */
class ExportCommand extends Command
{
    /**
     * @param {application.Context} context
     */
    constructor(context)
    {
        super(context);

        // Assign options
        this._name = ['export'];
        this._exportName = 'default';
        this._moduleConfigurationClass = Base;
        this._exportTaskClass = Task;
        this._loggerPrefix = 'command.export';
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [Context] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'command/ExportCommand';
    }


    /**
     * @inheritDocs
     */
    get help()
    {
        const help =
        {
            name: this._name,
            description: 'Exports templates as ' + this.exportName + ' files',
            actions:
            [
                {
                    name: this.exportName,
                    description: 'Exports templates as ' + this.exportName + ' files',
                    options:
                    [
                        {
                            name: 'query',
                            type: 'inline',
                            optional: true,
                            defaultValue: '*',
                            description: 'Query for sites to use e.g. /base'
                        },
                        {
                            name: 'destination',
                            type: 'named',
                            value: 'path',
                            optional: true,
                            defaultValue: '',
                            description: 'Define a base folder where files are written to'
                        }
                    ]
                }
            ]
        };
        return help;
    }


    /**
     * @type {task.Task}
     */
    get exportTaskClass()
    {
        return this._exportTaskClass;
    }


    /**
     * @type {Base}
     */
    get moduleConfigurationClass()
    {
        return this._moduleConfigurationClass;
    }


    /**
     * @inheritDocs
     */
    get exportName()
    {
        return this._exportName;
    }


    /**
     * @type {String}
     */
    get loggerPrefix()
    {
        return this._loggerPrefix;
    }


    /**
     * Adds custom tasks to the export action
     *
     * @returns {Promise}
     */
    addTaskOptions(options)
    {
        return Promise.resolve(options);
    }


    /**
     * Adds custom tasks to the export action
     *
     * @returns {Promise}
     */
    addTasks(task, mapping)
    {
        return Promise.resolve(task);
    }


    /**
     * Exports templates as files
     *
     * @returns {Promise}
     */
    export(parameters)
    {
        const scope = this;
        const promise = co(function *()
        {
            const logger = scope.createLogger(scope.loggerPrefix + '.' + scope.exportName);
            const mapping = new Map();
            mapping.set(CliLogger, logger);
            const pathesConfiguration = scope.context.di.create(PathesConfiguration);
            const moduleConfiguration = scope.context.di.create(scope.moduleConfigurationClass);
            const buildConfiguration = scope.context.di.create(BuildConfiguration);
            let prepend = false;
            if (buildConfiguration.get('export.banner', false))
            {
                prepend = '/** ' + buildConfiguration.get('export.banner', false) + ' **/';
            }
            const options = yield scope.addTaskOptions(
                {
                    writePath: yield pathesConfiguration.resolve((parameters && parameters.destination) || moduleConfiguration.exportPath),
                    query: parameters && parameters._ && parameters._[0] || '*',
                    decorateVariables:
                    {
                        date: new Date(),
                        gitHash: yield gitRev.long(),
                        gitBranch: yield gitRev.branch()
                    },
                    decoratePrepend: prepend
                });
            let task = scope.context.di.create(scope.exportTaskClass, mapping);
            task = task.pipe(scope.context.di.create(DecorateTask, mapping));
            task = yield scope.addTasks(task, mapping);
            task = task.pipe(scope.context.di.create(WriteFilesTask, mapping));
            yield task.run(buildConfiguration, options);
            return true;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }


    /**
     * @inheritDocs
     */
    dispatch(action, parameters)
    {
        const actionName = this.exportName.toLowerCase();
        switch((action || '').toLowerCase())
        {
            case actionName:
                return this.export(parameters);
        }
        return Promise.resolve(false);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ExportCommand = ExportCommand;
