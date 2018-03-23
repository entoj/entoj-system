'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const TranslationsRepository = require('../../model/translation/TranslationsRepository.js').TranslationsRepository;
const SystemModuleConfiguration = require('../../configuration/SystemModuleConfiguration.js').SystemModuleConfiguration;
const assertParameter = require('../../utils/assert.js').assertParameter;
const waitForPromise = require('../../utils/synchronize.js').waitForPromise;


/**
 * @memberOf nunjucks.filter
 */
class TranslateFilter extends Filter
{
    /**
     * @inheritDocs
     */
    constructor(translationsRepository, moduleConfiguration)
    {
        super();

        // Check params
        assertParameter(this, 'translationsRepository', translationsRepository, true, TranslationsRepository);
        assertParameter(this, 'moduleConfiguration', moduleConfiguration, true, SystemModuleConfiguration);

        // Assign options
        this._name = 'translate';
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
        return 'nunjucks.filter/TranslateFilter';
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
    filter()
    {
        const scope = this;
        return function (value, ...variables)
        {
            // Use value or key for translations
            let translationKey = value;
            if (!translationKey && variables)
            {
                translationKey = variables.shift();
            }
            if (!translationKey || typeof translationKey !== 'string')
            {
                scope.logger.warn('Missing translation key');
                return scope.applyCallbacks('', arguments);
            }

            // Translate
            const globals = scope.getGlobals(this);
            const site = globals.location.site || false;
            const language = (globals.configuration && typeof globals.configuration.getByPath == 'function')
                ? globals.configuration.getByPath('filters.translateLanguage', scope.moduleConfiguration.translateLanguage)
                : scope.moduleConfiguration.translateLanguage;
            const translation = waitForPromise(scope.translationsRepository.getByNameSiteAndLanguage(translationKey, site, language));
            if (!translation)
            {
                scope.logger.warn('Missing translation for key', value);
                return scope.applyCallbacks(value, arguments);
            }
            let result = translation;
            if (variables && variables.length)
            {
                for (let index = 0; index < variables.length; index++)
                {
                    result = result.replace('{' + index + '}', variables[index]);
                }
            }
            return scope.applyCallbacks(result, arguments);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.TranslateFilter = TranslateFilter;
