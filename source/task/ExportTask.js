'use strict';

/**
 * Requirements
 * @ignore
 */
const EntitiesTask = require('./EntitiesTask.js').EntitiesTask;
const GlobalRepository = require('../model/GlobalRepository.js').GlobalRepository;
const Exporter = require('../export/Exporter.js').Exporter;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const assertParameter = require('../utils/assert.js').assertParameter;
const VinylFile = require('vinyl');
const co = require('co');


/**
 * @memberOf task
 */
class ExportTask extends EntitiesTask
{
    /**
     * @param {cli.CliLogger} cliLogger
     * @param {model.GlobalRepository} globalRepository
     * @param {export.Exporter} exporter
     */
    constructor(cliLogger, globalRepository, exporter)
    {
        super(cliLogger, globalRepository);

        //Check params
        assertParameter(this, 'exporter', exporter, true, Exporter);

        // Assign options
        this._exporter = exporter;
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [CliLogger, GlobalRepository, Exporter] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'task/ExportTask';
    }


    /**
     * @inheritDocs
     */
    get sectionName()
    {
        return 'Exporting files';
    }


    /**
     * @type {String}
     */
    get exportName()
    {
        return 'default';
    }


    /**
     * @type {export.Exporter}
     */
    get exporter()
    {
        return this._exporter;
    }


    /**
     * @returns {Promise<VinylFile>}
     */
    renderEntity(entity, entitySettings, buildConfiguration, parameters)
    {
        if (!entity)
        {
            this.logger.warn(this.className + '::renderEntity - No entity given');
            return Promise.resolve(false);
        }

        const scope = this;
        const promise = co(function *()
        {
            // Prepare
            const settings = entitySettings || {};
            const macroName = settings.macro || false;
            const siteName = entity.site.name;
            const entityName = entity.idString;

            // Export
            let workMessage = 'Exporting <' + entity.pathString + '>';
            if (macroName)
            {
                workMessage+= ' / macro <' + macroName + '>';
            }
            const work = scope.cliLogger.work(workMessage);
            const exported = yield scope.exporter.export(siteName, entityName, macroName, settings);
            scope.cliLogger.end(work);

            // Done
            const file = new VinylFile(
                {
                    path: exported.configuration.filename,
                    contents: new Buffer(exported.contents)
                });
            return file;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }


    /**
     * @returns {Promise<Array<VinylFile>>}
     */
    processEntity(entity, buildConfiguration, parameters)
    {
        /* istanbul ignore next */
        if (!entity)
        {
            this.logger.warn(this.className + '::processEntity - No entity given');
            return Promise.resolve(false);
        }

        const scope = this;
        const promise = co(function *()
        {
            // Render each configured release
            const result = [];
            const settings = entity.properties.getByPath('export.' + scope.exportName, []);
            for (const setting of settings)
            {
                // Render entity
                const file = yield scope.renderEntity(entity, setting, buildConfiguration, parameters);
                if (file)
                {
                    result.push(file);
                }
            }
            return result;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ExportTask = ExportTask;
