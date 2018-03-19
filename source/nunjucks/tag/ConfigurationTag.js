'use strict';

/**
 * Requirements
 * @ignore
 */
const Tag = require('./Tag.js').Tag;


/**
 * @memberOf nunjucks.tag
 */
class ConfigurationTag extends Tag
{
    /**
     */
    constructor()
    {
        super();

        // Assign options
        this._hasBody = false;
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.tag/ConfigurationTag';
    }


    /**
     * @inheritDoc
     */
    get name()
    {
        return ['configuration'];
    }


    /**
     * @inheritDoc
     */
    generate(context, params, caller)
    {
        if (!params.value || !params.name)
        {
            return '';
        }
        const configuration = (context.env.globals && context.env.globals.__configuration__)
            ? context.env.globals.__configuration__
            : {};
        configuration[params.name] = params.value;
        return '';
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ConfigurationTag = ConfigurationTag;
