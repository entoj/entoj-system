'use strict';

/**
 * Requirements
 * @ignore
 */
const SearchableArray = require('../../base/SearchableArray.js').SearchableArray;


/**
 * @class
 * @memberOf model.docmentation
 * @extends {Base}
 */
class LinterResultArray extends SearchableArray
{
    /**
     * The namespaced class name
     *
     * @type {string}
     * @static
     */
    static get className()
    {
        return 'model.linter/LinterResultArray';
    }


    /**
     * @param {Array} data
     */
    import(data)
    {
        const items = Array.isArray(data)
            ? data
            : [data];
        for (const item of items)
        {
            let resultItem = this.findBy(
                {
                    linter: data.linter
                });
            if (!resultItem)
            {
                resultItem = new LinterResult();
            }
            resultItem.load(item);
        }
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.LinterResultArray = LinterResultArray;
