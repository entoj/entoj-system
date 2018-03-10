'use strict';

/**
 * Requirements
 * @ignore
 */
const ModelSynchronizerDataPlugin = require('./ModelSynchronizerDataPlugin.js').ModelSynchronizerDataPlugin;
const SitesRepository = require('../model/site/SitesRepository.js').SitesRepository;
const SettingsRepository = require('../model/setting/SettingsRepository.js').SettingsRepository;
const PathesConfiguration = require('../model/configuration/PathesConfiguration.js').PathesConfiguration;
const CliLogger = require('../cli/CliLogger.js').CliLogger;


/**
 * @memberOf watch
 */
class ModelSynchronizerSettingsPlugin extends ModelSynchronizerDataPlugin
{
    /**
     * @param {CliLogger} cliLogger
     * @param {model.site.SitesRepository} sitesRepository
     * @param {model.setting.SettingsRepository} settingsRepository
     * @param {model.configuration.PathesConfiguration} pathesConfiguration
     */
    constructor(cliLogger, sitesRepository, settingsRepository, pathesConfiguration)
    {
        super(cliLogger.createPrefixed('modelsynchronizer.settings'), sitesRepository, settingsRepository, pathesConfiguration);
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [CliLogger, SitesRepository, SettingsRepository, PathesConfiguration] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'watch/ModelSynchronizerSettingsPlugin';
    }


    /**
     * @type {String}
     */
    get workName()
    {
        return 'Invalidating <ModelSynchronizerSettingsPlugin>';
    }


    /**
     * @type {String}
     */
    get resultName()
    {
        return 'setting';
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ModelSynchronizerSettingsPlugin = ModelSynchronizerSettingsPlugin;
