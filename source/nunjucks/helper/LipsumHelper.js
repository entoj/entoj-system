'use strict';

/**
 * Requirements
 * @ignore
 */
const Helper = require('./Helper.js').Helper;
const uppercaseFirst = require('../../utils/string.js').uppercaseFirst;
const lorem = require('lorem-ipsum');


/**
 * Generates random lorem ipsum text.
 *
 * @memberOf nunjucks.filter
 */
class LipsumHelper extends Helper
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
        return 'nunjucks.helper/LipsumHelper';
    }


    /**
     * @inheritDoc
     */
    helper(unit, minCount, maxCount)
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
        return this.applyCallbacks(uppercaseFirst(lorem(options)), arguments, options);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.LipsumHelper = LipsumHelper;
