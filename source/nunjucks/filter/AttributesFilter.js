'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const kebabCase = require('lodash.kebabcase');
const isPlainObject = require('lodash.isplainobject');
const htmlEncode = require('htmlencode').htmlEncode;


/**
 * @memberOf nunjucks.filter
 */
class AttributesFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor()
    {
        super();
        this._name = ['customAttributes', 'attributes'];
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/AttributesFilter';
    }


    /**
     * @inheritDoc
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
                if (typeof value[key] !== 'undefined')
                {
                    const escapedValue = htmlEncode(value[key].toString());
                    result += pref + kebabCase(key) + '="' + escapedValue + '" ';
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
module.exports.AttributesFilter = AttributesFilter;
