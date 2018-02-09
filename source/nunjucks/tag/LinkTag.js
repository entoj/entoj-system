'use strict';

/**
 * Requirements
 * @ignore
 */
const HtmlTag = require('./HtmlTag.js').HtmlTag;


/**
 * @memberOf nunjucks.tag
 */
class LinkTag extends HtmlTag
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.tag/LinkTag';
    }


    /**
     * @type {Array}
     */
    get tags()
    {
        return ['link'];
    }    


    /**
     * @type {String}
     */
    get tagName()
    {
        return 'a';
    } 
}


/**
 * Exports
 * @ignore
 */
module.exports.LinkTag = LinkTag;
