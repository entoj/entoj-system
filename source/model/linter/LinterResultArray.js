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
     * @ignore
     */
    constructor(...args)
    {
        super(...args);

        // Initial values
        this._warningCount = 0;
        this._errorCount = 0;
        this._success = true;

        // Listen for changes
        this.events.on('change', this.updateSummary.bind(this));
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.linter/LinterResultArray';
    }


    /**
     * @protected
     */
    updateSummary()
    {
        this._warningCount = 0;
        this._errorCount = 0;
        for (const item of this)
        {
            this._warningCount+= item.warningCount;
            this._errorCount+= item.errorCount;
        }
        this._success = this._warningCount === 0 && this._errorCount === 0;
    }


    /**
     * @type {Number}
     */
    get warningCount()
    {
        return this._warningCount;
    }


    /**
     * @type {Number}
     */
    get errorCount()
    {
        return this._errorCount;
    }


    /**
     * @type {Boolean}
     */
    get success()
    {
        return this._success;
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
