'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const uppercaseFirst = require('../../utils/string.js').uppercaseFirst;
const lorem = require('lorem-ipsum');


/**
 * Generates random lorem ipsum text.
 *
 * @memberOf nunjucks.filter
 */
class LipsumFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor()
    {
        super();
        this._name = 'lipsum';
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/LipsumFilter';
    }


    /**
     * @inheritDoc
     */
    filter(value)
    {
        const scope = this;
        return function (value, unit, minCount, maxCount)
        {
            // Prepare
            const options =
            {
                units: 'words',
                count: 1
            };

            // Unit
            if (unit == 's')
            {
                options.units = 'sentences';
            }
            if (unit == 'p')
            {
                options.units = 'paragraphs';
            }

            // Count
            const min = minCount || 1;
            const max = maxCount || 10;
            options.count = min + ((max - min) * Math.random());

            // Generate
            return scope.applyCallbacks(uppercaseFirst(lorem(options)), arguments, options);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.LipsumFilter = LipsumFilter;
