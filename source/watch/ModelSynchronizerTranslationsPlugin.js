'use strict';

/**
 * Requirements
 * @ignore
 */
const ModelSynchronizerDataPlugin = require('./ModelSynchronizerDataPlugin.js').ModelSynchronizerDataPlugin;
const SitesRepository = require('../model/site/SitesRepository.js').SitesRepository;
const TranslationsRepository = require('../model/translation/TranslationsRepository.js').TranslationsRepository;
const PathesConfiguration = require('../model/configuration/PathesConfiguration.js').PathesConfiguration;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const co = require('co');


/**
 * @memberOf watch
 */
class ModelSynchronizerTranslationsPlugin extends ModelSynchronizerDataPlugin
{
    /**
     * @param {CliLogger} cliLogger
     * @param {model.site.SitesRepository} sitesRepository
     * @param {model.translations.TranslationsRepository} translationsRepository
     * @param {model.configuration.PathesConfiguration} pathesConfiguration
     */
    constructor(cliLogger, sitesRepository, translationsRepository, pathesConfiguration)
    {
        super(cliLogger.createPrefixed('modelsynchronizer.translations'), sitesRepository, translationsRepository, pathesConfiguration);
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
     * @type {String}
     */
    get workName()
    {
        return 'Invalidating <TranslationsRepository>';
    }


    /**
     * @type {String}
     */
    get resultName()
    {
        return 'translation';
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
                for (const language of scope.dataRepository.loader.languages)
                {
                    const fullFilename = yield scope.dataRepository.loader.generateFilename({ site: site, language: language });
                    const filename = fullFilename.replace(scope.pathesConfiguration.sites, '');
                    result[filename] = site;
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
