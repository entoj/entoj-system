'use strict';

/**
 * Requirements
 * @ignore
 */
const ModelSynchronizerPlugin = require('./ModelSynchronizerPlugin.js').ModelSynchronizerPlugin;
const SitesRepository = require('../model/site/SitesRepository.js').SitesRepository;
const TranslationsRepository = require('../model/translation/TranslationsRepository.js').TranslationsRepository;
const PathesConfiguration = require('../model/configuration/PathesConfiguration.js').PathesConfiguration;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const assertParameter = require('../utils/assert.js').assertParameter;
const co = require('co');


/**
 * @memberOf watch
 */
class ModelSynchronizerTranslationsPlugin extends ModelSynchronizerPlugin
{
    /**
     * @param {CliLogger} cliLogger
     * @param {model.site.SitesRepository} sitesRepository
     * @param {model.translations.TranslationsRepository} translationsRepository
     * @param {model.configuration.PathesConfiguration} pathesConfiguration
     */
    constructor(cliLogger, sitesRepository, translationsRepository, pathesConfiguration)
    {
        super(cliLogger.createPrefixed('modelsynchronizer.sites'));

        //Check params
        assertParameter(this, 'sitesRepository', sitesRepository, true, SitesRepository);
        assertParameter(this, 'translationsRepository', translationsRepository, true, TranslationsRepository);
        assertParameter(this, 'pathesConfiguration', pathesConfiguration, true, PathesConfiguration);

        // Assign options
        this._sitesRepository = sitesRepository;
        this._translationsRepository = translationsRepository;
        this._pathesConfiguration = pathesConfiguration;
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [CliLogger, SitesRepository, TranslationsRepository, PathesConfiguration] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'watch/ModelSynchronizerTranslationsPlugin';
    }


    /**
     * @type {model.site.SitesRepository}
     */
    get sitesRepository()
    {
        return this._sitesRepository;
    }


    /**
     * @type {model.translations.TranslationsRepository}
     */
    get translationsRepository()
    {
        return this._translationsRepository;
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
    execute(changes)
    {
        const scope = this;
        const promise = co(function *()
        {
            const result = {};

            // Create list of filenames
            const filenames = {};
            const sites = yield scope.sitesRepository.getItems();
            for (const site of sites)
            {
                const fullFilename = yield scope.translationsRepository.loader.generateFilename(site);
                const filename = fullFilename.replace(scope.pathesConfiguration.sites, '');
                filenames[filename] = site;
            }

            // Apply changes for files that match the translations filename
            if (changes.files)
            {
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
                if (changesSites)
                {
                    const work = scope.cliLogger.work('Invalidating <TranslationsRepository>');
                    result.translation = yield scope.translationsRepository.invalidate(changesSites);
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
module.exports.ModelSynchronizerTranslationsPlugin = ModelSynchronizerTranslationsPlugin;
