'use strict';

/**
 * Requirements
 * @ignore
 */
const ModelSynchronizerPlugin = require('./ModelSynchronizerPlugin.js').ModelSynchronizerPlugin;
const EntitiesRepository = require('../model/entity/EntitiesRepository.js').EntitiesRepository;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const assertParameter = require('../utils/assert.js').assertParameter;
const co = require('co');


/**
 * @memberOf watch
 */
class ModelSynchronizerEntitiesPlugin extends ModelSynchronizerPlugin
{
    /**
     * @param {CliLogger} cliLogger
     * @param {model.entity.EntitiesRepository} entityCategoriesRepository
     */
    constructor(cliLogger, entitiesRepository)
    {
        super(cliLogger.createPrefixed('modelsynchronizer.entities'));

        //Check params
        assertParameter(this, 'entitiesRepository', entitiesRepository, true, EntitiesRepository);

        // Assign options
        this._entitiesRepository = entitiesRepository;
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [CliLogger, EntitiesRepository] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'watch/ModelSynchronizerEntitiesPlugin';
    }


    /**
     * @type {model.entity.EntitiesRepository}
     */
    get entitiesRepository()
    {
        return this._entitiesRepository;
    }


    /**
     * @returns {Promise.<*>}
     */
    execute(changes)
    {
        const scope = this;
        const promise = co(function *()
        {
            const result = {};

            if (changes.entity)
            {
                const work = scope.cliLogger.work('Invalidating <EntitiesRepository>');
                result.entity = yield scope.entitiesRepository.invalidate(changes.entity);
                scope.cliLogger.end(work);
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
module.exports.ModelSynchronizerEntitiesPlugin = ModelSynchronizerEntitiesPlugin;
