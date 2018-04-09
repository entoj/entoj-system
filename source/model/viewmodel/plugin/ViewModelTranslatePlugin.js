'use strict';

/**
 * Requirements
 * @ignore
 */
const ViewModelPlugin = require('../ViewModelPlugin.js').ViewModelPlugin;
const TranslationsRepository = require('../../translation/TranslationsRepository.js').TranslationsRepository;
const SystemModuleConfiguration = require('../../../configuration/SystemModuleConfiguration.js').SystemModuleConfiguration;
const assertParameter = require('../../../utils/assert.js').assertParameter;
const co = require('co');


/**
 * @class
 * @memberOf model.viewmodel.plugin
 * @extends {Base}
 */
class ViewModelTranslatePlugin extends ViewModelPlugin
{
    /**
     * @param {model.translation.TranslationsRepository} translationsRepository
     * @param {model.configuration.SystemModuleConfiguration} moduleConfiguration
     */
    constructor(translationsRepository, moduleConfiguration)
    {
        super();

        // Check params
        assertParameter(this, 'translationsRepository', translationsRepository, true, TranslationsRepository);
        assertParameter(this, 'moduleConfiguration', moduleConfiguration, true, SystemModuleConfiguration);

        // Assign options
        this._name = ['translate'];
        this._translationsRepository = translationsRepository;
        this._moduleConfiguration = moduleConfiguration;
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [TranslationsRepository, SystemModuleConfiguration] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.viewmodel.plugin/ViewModelTranslatePlugin';
    }


    /**
     * @type {model.translation.TranslationsRepository}
     */
    get translationsRepository()
    {
        return this._translationsRepository;
    }


    /**
     * @type {configuration.SystemModuleConfiguration}
     */
    get moduleConfiguration()
    {
        return this._moduleConfiguration;
    }


    /**
     * @inheritDoc
     */
    doExecute(repository, site, useStaticContent, name, parameters)
    {
        const scope = this;
        const promise = co(function*()
        {
            const translation = yield scope.translationsRepository.getByNameSiteAndLanguage(parameters, site, scope.moduleConfiguration.translateLanguage);
            if (typeof translation == 'undefined')
            {
                return parameters;
            }
            return translation;
        });
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ViewModelTranslatePlugin = ViewModelTranslatePlugin;
