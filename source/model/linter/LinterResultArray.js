'use strict';

/**
 * Requirements
 * @ignore
 */
const SearchableArray = require('../../base/SearchableArray.js').SearchableArray;
const LinterResult = require('./LinterResult.js').LinterResult;


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
            let linterResult = this.findBy(
                {
                    linter: data.linter
                });
            if (!linterResult)
            {
                linterResult = new LinterResult();
                this.push(linterResult);
            }
            linterResult.dehydrate(item);
        }
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.LinterResultArray = LinterResultArray;
