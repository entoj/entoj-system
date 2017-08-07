'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const GlobalConfiguration = require('../../model/configuration/GlobalConfiguration.js').GlobalConfiguration;
const assertParameter = require('../../utils/assert.js').assertParameter;
const moment = require('moment');

/**
 * Formats a date
 *
 * @memberOf nunjucks.filter
 */
class FormatDateFilter extends Filter
{
    /**
     * @inheritDocs
     */
    constructor(globalConfiguration)
    {
        super();

        // Check params
        assertParameter(this, 'globalConfiguration', globalConfiguration, true, GlobalConfiguration);

        // Assign options
        this._name = ['formatDate', 'date'];
        this._globalConfiguration = globalConfiguration;
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [GlobalConfiguration] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'nunjucks.filter/FormatDateFilter';
    }


    /**
     * @type {model.configuration.GlobalConfiguration}
     */
    get globalConfiguration()
    {
        return this._globalConfiguration;
    }


    /**
     * @inheritDocs
     */
    filter()
    {
        const scope = this;
        return function(value, format)
        {
            return moment(value).format(format || scope.globalConfiguration.get('formats.date'));
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.FormatDateFilter = FormatDateFilter;
