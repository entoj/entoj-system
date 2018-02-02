'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const kebabCase = require('lodash.kebabcase');
const isPlainObject = require('lodash.isplainobject');


/**
 * @memberOf nunjucks.filter
 */
class AttributesFilter extends Filter
{
    /**
     * @inheritDocs
     */
    constructor()
    {
        super();
        this._name = ['customAttributes', 'attributes'];
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'nunjucks.filter/AttributesFilter';
    }


    /**
     * @inheritDocs
     */
    filter(value)
    {
        const scope = this;
        return function(value, prefix)
        {
            if (!value || !isPlainObject(value))
            {
                return scope.applyCallbacks('');
            }
            let result = '';
            const pref = prefix ? prefix + '-' : '';
            for (const key in value)
            {
                result += pref + kebabCase(key) + '="' + value[key] + '" ';
            }
            return scope.applyCallbacks(result, arguments);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.AttributesFilter = AttributesFilter;
