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
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [CliLogger, GlobalRepository] };
    }


    /**
     * @inheritDocs
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
     * @returns {Promise<Array>}
     */
    processEntity(entity, buildConfiguration, parameters)
    {
        return Promise.resolve(false);
    }


    /**
     * @inheritDocs
     * @returns {Promise<Array>}
     */
    processEntities(buildConfiguration, parameters)
    {
        const scope = this;
        const promise = co(function *()
        {
            // Prepare
            const params = yield scope.prepareParameters(buildConfiguration, parameters);

            // Process each entity
            const result = [];
            const entities = yield scope.globalRepository.resolveEntities(params.query);
            for (const entity of entities)
            {
                // Render entity
                const entityResult = yield scope.processEntity(entity, buildConfiguration, parameters);
                if (Array.isArray(entityResult))
                {
                    result.push(...entityResult);
                }
            }

            // Done
            return result;
        });
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
                const work = scope._cliLogger.section(scope.sectionName);
                const params = yield scope.prepareParameters(buildConfiguration, parameters);
                scope.cliLogger.options(params);
                const files = yield scope.processEntities(buildConfiguration, parameters);
                for (const file of files)
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
