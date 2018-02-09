'use strict';

/**
 * Requirements
 * @ignore
 */
const Tag = require('./Tag.js').Tag;
const isPlainObject = require('lodash.isplainobject');


/**
 * @memberOf nunjucks.tag
 */
class HtmlTag extends Tag
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.tag/HtmlTag';
    }


    /**
     * @type {Array}
     */
    get tags()
    {
        return ['tag'];
    }    


    /**
     * @type {String}
     */
    get tagName()
    {
        return 'div';
    } 


    /**
     * Runs the tag
     */
    run(context, params, content)
    {
        let result = '<' + this.tagName;
        for (const key in params)
        {
            if (!key.startsWith('__'))
            {
                const value = params[key];
                if (typeof value === 'string' || 
                    typeof value === 'number' ||
                    typeof value === 'boolean')
                {
                    result+= ' ' + key + '="' + value + '"';
                }  
                else if (isPlainObject(value))
                {
                    for (const subKey in value)
                    {
                        result+= ' ' + subKey + '="' + value[subKey] + '"';
                    }                    
                }                   
            }
        }
        result+= '>';
        result+= content();
        result+= '</' + this.tagName + '>';
        return result;
    }    
}


/**
 * Exports
 * @ignore
 */
module.exports.HtmlTag = HtmlTag;
