'use strict';

/**
 * Requirements
 * @ignore
 */
const DocumentableValueObject = require('../DocumentableValueObject.js').DocumentableValueObject;


/**
 * Describes a Site
 *
 * @memberOf model.site
 */
class Site extends DocumentableValueObject
{
    /**
     * @constant {string}
     * @static
     */
    static get NAME()
    {
        return 'name';
    }


    /**
     * @constant {array}
     * @static
     */
    static get ANY()
    {
        return ['name'];
    }


    /**
     * @inheritDocs
     */
    get fields()
    {
        const fields = super.fields;
        fields.name = '';
        fields.description = '';
        fields.extends = false;
        return fields;
    }


    /**
     * @inheritDocs
     */
    initialize()
    {
        super.initialize();
        this._name = '';
        this._description = '';
        this._extends = false;
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model.site/Site';
    }


    /**
     * @inheritDocs
     */
    get uniqueId()
    {
        return this._name;
    }


    /**
     * @let {String}
     */
    get name()
    {
        return this._name;
    }

    set name(value)
    {
        this._name = value;
    }


    /**
     * @let {String}
     */
    get description()
    {
        return this._description;
    }

    set description(value)
    {
        this._description = value;
    }


    /**
     * @let {site}
     */
    get extends()
    {
        return this._extends;
    }

    set extends(value)
    {
        this._extends = value;
    }


    /**
     * @inheritDocs
     */
    toString()
    {
        return `[${this.className} ${this.name}]`;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Site = Site;
