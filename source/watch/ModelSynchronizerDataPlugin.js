'use strict';

/**
 * Requirements
 * @ignore
 */
const ModelSynchronizerPlugin = require('./ModelSynchronizerPlugin.js').ModelSynchronizerPlugin;
const SitesRepository = require('../model/site/SitesRepository.js').SitesRepository;
const DataRepository = require('../model/data/DataRepository.js').DataRepository;
const PathesConfiguration = require('../model/configuration/PathesConfiguration.js').PathesConfiguration;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const assertParameter = require('../utils/assert.js').assertParameter;
const co = require('co');


/**
 * @memberOf watch
 */
class ModelSynchronizerDataPlugin extends ModelSynchronizerPlugin
{
    /**
     * @param {CliLogger} cliLogger
     * @param {model.site.SitesRepository} sitesRepository
     * @param {model.data.DataRepository} dataRepository
     * @param {model.configuration.PathesConfiguration} pathesConfiguration
     */
    constructor(cliLogger, sitesRepository, dataRepository, pathesConfiguration)
    {
        super(cliLogger.createPrefixed('modelsynchronizer.data'));

        //Check params
        assertParameter(this, 'sitesRepository', sitesRepository, true, SitesRepository);
        assertParameter(this, 'dataRepository', dataRepository, true, DataRepository);
        assertParameter(this, 'pathesConfiguration', pathesConfiguration, true, PathesConfiguration);

        // Assign options
        this._sitesRepository = sitesRepository;
        this._dataRepository = dataRepository;
        this._pathesConfiguration = pathesConfiguration;
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [CliLogger, SitesRepository, DataRepository, PathesConfiguration] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'watch/ModelSynchronizerDataPlugin';
    }


    /**
     * @type {String}
     */
    get workName()
    {
        return 'Invalidating <DataRepository>';
    }


    /**
     * @type {String}
     */
    get resultName()
    {
        return 'data';
    }


    /**
     * @type {model.site.SitesRepository}
     */
    get sitesRepository()
    {
        return this._sitesRepository;
    }


    /**
     * @type {model.data.DataRepository}
     */
    get dataRepository()
    {
        return this._dataRepository;
    }


    /**
     * @type {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration()
    {
        return this._pathesConfiguration;
    }


    /**
     * @returns {Promise.<*>}
     */
    createFilenames()
    {
        const scope = this;
        const promise = co(function *()
        {
            const result = {};
            const sites = yield scope.sitesRepository.getItems();
            for (const site of sites)
            {
                const fullFilename = yield scope.dataRepository.loader.generateFilename({ site: site });
                const filename = fullFilename.replace(scope.pathesConfiguration.sites, '');
                result[filename] = site;
            }

            return result;
        }).catch(ErrorHandler.handler(scope));
        return promise;
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

            // Apply changes for files that match any of the generated filenames
            if (changes.files)
            {
                // Create list of filenames
                const filenames = yield scope.createFilenames();

                // Get changed sites
                const changesSites =
                {
                    add: []
                };
                for (const file of changes.files)
                {
                    if (filenames[file])
                    {
                        changesSites.add.push(filenames[file]);
                    }
                }

                // Update
                if (changesSites.add.length)
                {
                    const work = scope.cliLogger.work(scope.workName);
                    result[scope.resultName] = yield scope.dataRepository.invalidate(changesSites);
                    result.consumed = true;
                    scope.cliLogger.end(work);
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
module.exports.ModelSynchronizerDataPlugin = ModelSynchronizerDataPlugin;
