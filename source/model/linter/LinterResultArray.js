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
class LinterResultArray extends SearchableArray {
    /**
     * @ignore
     */
    constructor(data) {
        super();

        // Initial values
        this._warningCount = 0;
        this._errorCount = 0;
        this._success = true;

        // Initial import
        if (data) {
            this.import(data);
            this.updateSummary();
        }

        // Listen for changes
        this.events.on('change', this.updateSummary.bind(this));
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'model.linter/LinterResultArray';
    }

    /**
     * @protected
     */
    updateSummary() {
        this._warningCount = 0;
        this._errorCount = 0;
        for (const item of this) {
            if (item && typeof item.warningCount != 'undefined') {
                this._warningCount += item.warningCount;
            }
            if (item && typeof item.errorCount != 'undefined') {
                this._errorCount += item.errorCount;
            }
        }
        this._success = this._warningCount === 0 && this._errorCount === 0;
    }

    /**
     * @type {Number}
     */
    get warningCount() {
        return this._warningCount;
    }

    /**
     * @type {Number}
     */
    get errorCount() {
        return this._errorCount;
    }

    /**
     * @type {Boolean}
     */
    get success() {
        return this._success;
    }

    /**
     * @type {Boolean}
     */
    successForKind(kind) {
        const linterResult = this.findBy({
            contentKind: kind
        });
        if (!linterResult) {
            return true;
        }
        return linterResult.success;
    }

    /**
     * @param {Array} data
     */
    import(data) {
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
            if (item.linter) {
                let linterResult = this.findBy({
                    linter: item.linter
                });
                if (!linterResult) {
                    linterResult = new LinterResult();
                    linterResult.dehydrate(item);
                    this.push(linterResult);
                } else {
                    linterResult.dehydrate(item);
                }
            } else {
                this.push(item);
            }
        }
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.LinterResultArray = LinterResultArray;
