'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const GlobalConfiguration = require('../../model/configuration/GlobalConfiguration.js').GlobalConfiguration;
const assertParameter = require('../../utils/assert.js').assertParameter;
const numeral = require('numeral');
/*
numeral.register('locale', 'de',
    {
        delimiters:
        {
            thousands: ' ',
            decimal: ','
        },
        abbreviations:
        {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function (number)
        {
            return '.';
        },
        currency:
        {
            symbol: '€'
        }
    });
numeral.locale('de');
*/


/**
 * Formats a number
 *
 * @memberOf nunjucks.filter
 */
class FormatNumberFilter extends Filter
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
        this._name = ['formatNumber', 'number'];
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
        return 'nunjucks.filter/FormatNumberFilter';
    }


    /**
     * @type {model.configuration.GlobalConfiguration}
     */
    get globalConfiguration()
    {
        return this._globalConfiguration;
    }


    /**
     * @type {String}
     */
    get format()
    {
        if (this.environment &&
            this.environment.buildConfiguration)
        {
            return this.environment.buildConfiguration.get('filters.formatNumber');
        }
        return false;
    }


    /**
     * @inheritDocs
     */
    filter()
    {
        const scope = this;
        return function(value, format)
        {
            const result = numeral(value).format(format || scope.format || scope.globalConfiguration.get('formats.number'));
            return scope.applyCallbacks(result, arguments);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.FormatNumberFilter = FormatNumberFilter;
