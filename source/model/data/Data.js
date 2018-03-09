'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueObject = require('../ValueObject.js').ValueObject;


/**
 * Describes a simple site specific data store
 *
 * @memberOf model.data
 */
class Data extends ValueObject
{
    /**
     * @constant {string}
     * @static
     */
    static get SITE()
    {
        return 'site';
    }


    /**
     * @constant {array}
     * @static
     */
    static get ANY()
    {
        return ['site'];
    }


    /**
     * @inheritDoc
     */
    get fields()
    {
        const fields = super.fields;
        fields.data = {};
        fields.site = false;
        return fields;
    }


    /**
     * @inheritDoc
     */
    initialize()
    {
        super.initialize();
        this._site = false;
        this._data = {};
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.data/Data';
    }


    /**
     * @inheritDoc
     */
    get uniqueId()
    {
        return (this.site)
            ? this.site.name
            : '__default__';
    }


    /**
     * @let {model.site.Site}
     */
    get site()
    {
        return this._site;
    }

    set site(value)
    {
        this._site = value;
    }


    /**
     * @let {String}
     */
    get data()
    {
        return this._data;
    }

    set data(value)
    {
        this._data = value;
    }


    /**
     * @inheritDoc
     */
    toString()
    {
        return `[${this.className} ${this.site}]`;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Data = Data;
