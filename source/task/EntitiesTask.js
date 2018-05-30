'use strict';

/**
 * Requirements
 * @ignore
 */
const Task = require('./Task.js').Task;
const GlobalRepository = require('../model/GlobalRepository.js').GlobalRepository;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const assertParameter = require('../utils/assert.js').assertParameter;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const metrics = require('../utils/performance.js').metrics;
const through2 = require('through2');
const co = require('co');


/**
 * @memberOf task
 */
class EntitiesTask extends Task
{
    /**
     *
     */
    constructor(cliLogger, globalRepository)
    {
        super(cliLogger);

        //Check params
        assertParameter(this, 'globalRepository', globalRepository, true, GlobalRepository);

        // Assign options
        this._globalRepository = globalRepository;
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [CliLogger, GlobalRepository] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'task/EntitiesTask';
    }


    /**
     * @inheritDoc
     */
    get sectionName()
    {
        return 'Processing entities';
    }


    /**
     * @type {model.GlobalRepository}
     */
    get globalRepository()
    {
        return this._globalRepository;
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
                params.query = params.query || '*';
                return params;
            });
        return promise;
    }


    /**
     * @inheritDoc
     * @returns {Promise<Array>}
     */
    prepare(buildConfiguration, parameters)
    {
        return Promise.resolve([]);
    }


    /**
     * @inheritDoc
     * @returns {Promise<Array>}
     */
    finalize(buildConfiguration, parameters)
    {
        return Promise.resolve([]);
    }


    /**
     * @returns {Promise<Array>}
     */
    processEntity(entity, buildConfiguration, parameters)
    {
        return Promise.resolve(false);
    }


    /**
     * @inheritDoc
     * @returns {Promise<Array>}
     */
    getEntities(query, buildConfiguration, parameters)
    {
        return this.globalRepository.resolveEntities(query);
    }


    /**
     * @inheritDoc
     * @returns {Promise<Array>}
     */
    processEntities(buildConfiguration, parameters)
    {
        const scope = this;
        const promise = co(function *()
        {
            metrics.pushScope(scope.className + '::processEntities');
            metrics.start(scope.className + '::processEntities');

            // Prepare
            metrics.start(scope.className + '::processEntities - prepareParameters');
            const params = yield scope.prepareParameters(buildConfiguration, parameters);
            metrics.stop(scope.className + '::processEntities - prepareParameters');

            // Process each entity
            const result = [];
            metrics.start(scope.className + '::processEntities - getEntities');
            const entities = yield scope.getEntities(params.query, buildConfiguration, params);
            metrics.stop(scope.className + '::processEntities - getEntities');
            for (const entity of entities)
            {
                // Render entity
                metrics.start(scope.className + '::processEntities - processEntity');
                const entityResult = yield scope.processEntity(entity, buildConfiguration, parameters);
                metrics.stop(scope.className + '::processEntities - processEntity');
                if (Array.isArray(entityResult))
                {
                    result.push(...entityResult);
                }
            }

            metrics.stop(scope.className + '::processEntities');
            metrics.popScope();

            // Done
            return result;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }


    /**
     * @returns {Stream}
     */
    stream(stream, buildConfiguration, parameters)
    {
        let resultStream = stream;
        if (!resultStream)
        {
            resultStream = through2(
                {
                    objectMode: true
                });
            const scope = this;
            co(function *()
            {
                const work = scope.cliLogger.section(scope.sectionName);
                const params = yield scope.prepareParameters(buildConfiguration, parameters);
                scope.cliLogger.options(params);
                const preparedFiles = yield scope.prepare(buildConfiguration, parameters);
                for (const file of preparedFiles)
                {
                    resultStream.write(file);
                }
                const files = yield scope.processEntities(buildConfiguration, parameters);
                for (const file of files)
                {
                    resultStream.write(file);
                }
                const finalizedFiles = yield scope.finalize(buildConfiguration, parameters);
                for (const file of finalizedFiles)
                {
                    resultStream.write(file);
                }
                resultStream.end();
                scope.cliLogger.end(work);
            }).catch(ErrorHandler.handler(scope));
        }
        return resultStream;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EntitiesTask = EntitiesTask;
