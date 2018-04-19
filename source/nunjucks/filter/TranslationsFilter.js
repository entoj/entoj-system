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
class TranslationsFilter extends Filter
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
        this._name = 'translations';
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
        return 'nunjucks.filter/TranslationsFilter';
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
        return function (value, lang)
        {
            // Site
            const globals = scope.getGlobals(this);
            const site = globals.location.site || false;

            // Languages
            const languages = lang
                ? lang
                : scope.moduleConfiguration.languages;

            // Get translations
            const queries = Array.isArray(value)
                ? value
                : [value];
            const result = {};
console.log('Items', waitForPromise(scope.translationsRepository.getItems()));
            for (const language of languages)
            {
                for (const query of queries)
                {
                    const translations = waitForPromise(scope.translationsRepository.getByQuerySiteAndLanguage(query, site, language)) || {};
console.log(language, translations);
                    result[language] = result[language] || {};
                    Object.assign(result[language], translations);
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
module.exports.TranslationsFilter = TranslationsFilter;
