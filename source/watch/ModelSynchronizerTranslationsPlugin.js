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
}


/**
 * Exports
 * @ignore
 */
module.exports.ModelSynchronizerTranslationsPlugin = ModelSynchronizerTranslationsPlugin;
