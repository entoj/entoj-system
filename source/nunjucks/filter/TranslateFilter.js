'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;


/**
 * @memberOf nunjucks.filter
 */
class TranslateFilter extends Filter
{
    /**
     * @inheritDocs
     */
    constructor(translations)
    {
        super();
        this._name = 'translate';

        // Assign options
        this._translations = translations || {};
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': ['nunjucks.filter/TranslateFilter.translations'] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'nunjucks.filter/TranslateFilter';
    }


    /**
     * @type {Object}
     */
    get translations()
    {
        return this._translations;
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
                return '';
            }

            // Translate
            if (!scope.translations[translationKey])
            {
                scope.logger.warn('Missing translation for ' + translationKey);
                return translationKey;
            }
            let result = scope.translations[translationKey];
            if (variables && variables.length)
            {
                for (let index = 0; index < variables.length; index++)
                {
                    result = result.replace('{' + index + '}', variables[index]);
                }
            }
            return result;
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.TranslateFilter = TranslateFilter;
