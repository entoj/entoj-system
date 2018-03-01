'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const TranslationsRepository = require('../../model/translation/TranslationsRepository.js').TranslationsRepository;
const waitForPromise = require('../../utils/synchronize.js').waitForPromise;


/**
 * @memberOf nunjucks.filter
 */
class TranslateFilter extends Filter
{
    /**
     * @inheritDocs
     */
    constructor(translationsRepository)
    {
        super();
        this._name = 'translate';

        // Assign options
        this._translationsRepository = translationsRepository;
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [TranslationsRepository] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'nunjucks.filter/TranslateFilter';
    }


    /**
     * @inheritDocs
     */
    get translationsRepository()
    {
        return this._translationsRepository;
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
            const translation = waitForPromise(scope.translationsRepository.findBy({ name: translationKey }));
            if (!translation)
            {
                scope.logger.warn('Missing translation for key', value);
                return scope.applyCallbacks('', arguments);
            }
            let result = translation.value;
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
