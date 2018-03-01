'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const createRandomNumberGenerator = require('../../utils/random.js').createRandomNumberGenerator;
const striptags = require('striptags');
const htmlify = require('../../utils/string.js').htmlify;


/**
 * @memberOf nunjucks.filter
 */
class MarkupFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor(styles)
    {
        super();
        this._name = 'markup';
        this._styles = (styles)
            ? styles
            : { 'plain': 'plain' };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/MarkupFilter';
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': ['nunjucks.filter/MarkupFilter.styles'] };
    }


    /**
     * @type {Object}
     */
    get styles()
    {
        return this._styles;
    }

    /**
     * @inheritDocs
     */
    filter()
    {
        const scope = this;
        return function (value, style)
        {
            const result = value || '';
            const styleName = scope.styles[style] || 'default';
            if (styleName == 'plain')
            {
                return striptags(result);
            }
            if (result.indexOf('<') > -1)
            {
                return result;
            }
            const globals = (this && this.env && this.env.globals)
                ? this.env.globals
                : { location: {} };
            const useStaticContent = scope.useStaticContent(globals.request);
            const tags =
            [
                {
                    name: 'a',
                    probability: 0.2,
                    attributes:
                    {
                        href: 'JavaScript:;'
                    }
                },
                {
                    name: ['b', 'i'],
                    probability: 0.2
                }
            ];
            const options =
            {
                tags: tags,
                random: createRandomNumberGenerator(useStaticContent)
            };
            return scope.applyCallbacks(htmlify(result, options), arguments, options);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.MarkupFilter = MarkupFilter;
