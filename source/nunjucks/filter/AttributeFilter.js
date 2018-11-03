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
class AttributeFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor()
    {
        super();
        this._name = ['attribute'];
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/AttributeFilter';
    }


    /**
     * @inheritDoc
     */
    filter(value)
    {
        const scope = this;
        return function(value, name, test)
        {
            if (!value || (typeof test !== 'undefined' && !test))
            {
                return scope.applyCallbacks('');
            }
            return scope.applyCallbacks(name + '="' + htmlEncode(value) + '"', arguments);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.AttributeFilter = AttributeFilter;
