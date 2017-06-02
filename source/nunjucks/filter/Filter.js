'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;


/**
 * Base class for nunjucks filters.
 *
 * @class
 * @memberOf nunjucks.filter
 * @extends Base
 */
class Filter extends Base
{
    /**
     */
    constructor()
    {
        super();
        this._name = 'filter';
        this._environment = false;
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/Filter';
    }


    /**
     * Name of the filter within templates.
     * This may also be a list of names.
     *
     * @property {String|Array<String>}
     */
    get name()
    {
        return Array.isArray(this._name) ? this._name : [this._name];
    }


    /**
     * The environment this filter is register on
     *
     * @property {nunjucks.Environment}
     */
    get environment()
    {
        return this._environment;
    }


    /**
     * Registers the filter with a nunjucks environent.
     *
     * @param {nunjucks.Environment} environment
     * @returns {Boolean}
     */
    register(environment)
    {
        if (!environment)
        {
            return false;
        }

        for (const name of this.name)
        {
            environment.addFilter(name, this.filter());
        }
        this._environment = environment;
        return true;
    }


    /**
     * The actual filter function
     *
     * @returns {Function}
     */
    filter()
    {
        return function()
        {
            return '';
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.Filter = Filter;
