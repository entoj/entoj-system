'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;
const BaseMap = require('../../base/BaseMap.js').BaseMap;


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
     * @param {Object} options
     */
    constructor(options)
    {
        super();
        const opts = options || {};
        this._name = opts.name || 'filter';
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
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': ['nunjucks.filter/Filter.options'] };
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
     * Applies environment callbacks to value
     *
     * @returns {*}
     */
    applyCallbacks(value, args, data)
    {
        if (!this.environment)
        {
            return value;
        }
        return this.environment.applyFilterCallbacks(this, value, args, data);
    }


    /**
     * Returns true when the filter should return static (read : no random) content.
     * This is used for tests or html exports.
     *
     * @param {Request} request
     * @returns {Boolean}
     */
    useStaticContent(request)
    {
        let result = false;
        if (request &&
            request.query &&
            typeof request.query.static !== 'undefined')
        {
            result = true;
        }
        if (this.environment &&
            this.environment.buildConfiguration &&
            this.environment.buildConfiguration.get('template.useStaticContent', false) === true)
        {
            result = true;
        }
        return result;
    }


    /**
     * Returns the globals used in the nunjucks environment
     *
     * @param {Nunjucks} context
     * @returns {Object}
     */
    getGlobals(context)
    {
        const globals = (context && context.env && context.env.globals)
            ? context.env.globals
            : this.environment.globals || {};
        const result =
        {
            global: globals.global || {},
            configuration: globals.__configuration__ || new BaseMap({}),
            location: globals.location || {},
            request: globals.request || false
        };
        return result;
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
