'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const ContentKind = require('../model/ContentKind.js').ContentKind;


/**
 * Base class for Linters.
 *
 * @memberOf linter
 * @extends Base
 */
class Linter extends Base
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'linter/Linter';
    }


    /**
     * @type {String}
     */
    get name()
    {
        return this.className.split('/').pop();
    }


    /**
     * @type {String}
     */
    get contentKind()
    {
        return ContentKind.UNKNOWN;
    }


    /**
     * @param {*} content
     * @param {Object} options
     * @returns {Promise<Object>}
     */
    lint(content, options)
    {
        const result =
        {
            success: true,
            errorCount:0,
            warningCount:0,
            messages:[]
        };
        return Promise.resolve(result);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Linter = Linter;
