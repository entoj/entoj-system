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
const isPlainObject = require('lodash.isplainobject');


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
     * value - Queries
     * languages - Language(s) to return (array, locale, all, current)
     * excludeQuery - if true will omit the query portion of the key
     */
    filter()
    {
        const scope = this;
        return function (value, languages, excludeQuery)
        {
            // Only handle strings
            if (isPlainObject(value))
            {
                return scope.applyCallbacks(value, arguments);
            }
            if (!value)
            {
                return scope.applyCallbacks({}, arguments);
            }

            // Site
            const globals = scope.getGlobals(this);
            const site = globals.location.site || false;

            // Languages
            let langs = scope.moduleConfiguration.languages;
            if (languages == 'current')
            {
                langs = (globals.configuration && typeof globals.configuration.getByPath == 'function')
                    ? [globals.configuration.getByPath('language', scope.moduleConfiguration.language)]
                    : [scope.moduleConfiguration.language];
            }
            else
            {
                langs = Array.isArray(languages)
                    ? languages
                    : [languages];
            }

            // Get translations
            const queries = Array.isArray(value)
                ? value
                : [value];
            const result = {};
            for (const language of langs)
            {
                for (const query of queries)
                {
                    const translations = waitForPromise(scope.translationsRepository.getByQuerySiteAndLanguage(query, site, language)) || {};
                    result[language] = result[language] || {};
                    if (excludeQuery)
                    {
                        for (const key in translations)
                        {
                            result[language][key.replace(query, '')] = translations[key];
                        }
                    }
                    else
                    {
                        Object.assign(result[language], translations);
                    }
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
