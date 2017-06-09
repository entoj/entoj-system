'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const striptags = require('striptags');
const htmlify = require('../../utils/string.js').htmlify;


/**
 * @memberOf nunjucks.filter
 */
class MarkupFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor()
    {
        super();
        this._name = 'markup';
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/MarkupFilter';
    }


    /**
     * @inheritDocs
     */
    filter()
    {
        return function (value, style)
        {
            const result = value || '';
            if (style == 'plain')
            {
                return striptags(result);
            }
            if (result.indexOf('<') > -1)
            {
                return result;
            }
            return htmlify(result);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.MarkupFilter = MarkupFilter;
