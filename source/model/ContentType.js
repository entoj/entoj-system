'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;


/**
 * @class
 * @memberOf model
 * @extends {Base}
 */
class ContentType extends Base
{
    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model/ContentType';
    }


    /**
     *
     */
    static get ANY()
    {
        return '*';
    }

    /**
     *
     */
    static get SASS()
    {
        return 'sass';
    }

    /**
     *
     */
    static get JS()
    {
        return 'js';
    }

    /**
     *
     */
    static get JSON()
    {
        return 'json';
    }

    /**
     *
     */
    static get JINJA()
    {
        return 'jinja';
    }

    /**
     *
     */
    static get MARKDOWN()
    {
        return 'markdown';
    }
}

/**
 * Public
 * @ignore
 */
module.exports.ContentType = ContentType;
