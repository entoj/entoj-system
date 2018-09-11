'use strict';

/**
 * Requirements
 * @ignore
 */
const ModelSynchronizerPlugin = require('./ModelSynchronizerPlugin.js').ModelSynchronizerPlugin;
const SitesRepository = require('../model/site/SitesRepository.js').SitesRepository;
const EntitiesRepository = require('../model/entity/EntitiesRepository.js').EntitiesRepository;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const assertParameter = require('../utils/assert.js').assertParameter;
const co = require('co');

/**
 * @memberOf watch
 */
class ModelSynchronizerSitesPlugin extends ModelSynchronizerPlugin {
    /**
     * @param {CliLogger} cliLogger
     * @param {model.site.SitesRepository} sitesRepository
     * @param {model.entity.EntitiesRepository} entitiesRepository
     */
    constructor(cliLogger, sitesRepository, entitiesRepository) {
        super(cliLogger.createPrefixed('modelsynchronizer.sites'));

        //Check params
        assertParameter(this, 'sitesRepository', sitesRepository, true, SitesRepository);
        assertParameter(this, 'entitiesRepository', entitiesRepository, true, EntitiesRepository);

        // Assign options
        this._sitesRepository = sitesRepository;
        this._entitiesRepository = entitiesRepository;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: [CliLogger, SitesRepository, EntitiesRepository] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'watch/ModelSynchronizerSitesPlugin';
    }

    /**
     * @type {model.site.SitesRepository}
     */
    get sitesRepository() {
        return this._sitesRepository;
    }

    /**
     * @type {model.entity.EntitiesRepository}
     */
    get entitiesRepository() {
        return this._entitiesRepository;
    }

    /**
     * @returns {Promise.<*>}
     */
    execute(changes) {
        const scope = this;
        const promise = co(function*() {
            const result = {};

            // Apply changes for sites
            if (changes.site) {
                const workSites = scope.cliLogger.work('Invalidating <SitesRepository>');
                result.site = yield scope.sitesRepository.invalidate(changes.site);
                scope.cliLogger.end(workSites);

                const workCategories = scope.cliLogger.work('Invalidating <EntitiesRepository>');
                result.entity = yield scope.entitiesRepository.invalidate();
                scope.cliLogger.end(workCategories);
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
module.exports.ModelSynchronizerSitesPlugin = ModelSynchronizerSitesPlugin;
