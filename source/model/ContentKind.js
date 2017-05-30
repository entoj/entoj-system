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
class ContentKind extends Base
{
    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model/ContentKind';
    }


    /**
     *
     */
    static get UNKNOWN()
    {
        return '*';
    }

    /**
     *
     */
    static get CSS()
    {
        return 'css';
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
    static get MACRO()
    {
        return 'macro';
    }

    /**
     *
     */
    static get EXAMPLE()
    {
        return 'example';
    }

    /**
     *
     */
    static get DATAMODEL()
    {
        return 'datamodel';
    }

    /**
     *
     */
    static get TEXT()
    {
        return 'text';
    }
}

/**
 * Public
 * @ignore
 */
module.exports.ContentKind = ContentKind;
