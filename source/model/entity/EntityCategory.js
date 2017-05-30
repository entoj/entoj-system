'use strict';

/**
 * Requirements
 * @ignore
 */
const DocumentableValueObject = require('../DocumentableValueObject.js').DocumentableValueObject;


/**
 * Describes entity categories in the system.
 * The main property of a category is its long name.
 *
 * A Common example would be catefgories like elements, modules, module groups
 *
 * @memberOf model.entity
 */
class EntityCategory extends DocumentableValueObject
{
    /**
     * @constant {string}
     * @static
     */
    static get LONG_NAME()
    {
        return 'longName';
    }

    /**
     * @constant {string}
     * @static
     */
    static get SHORT_NAME()
    {
        return 'shortName';
    }

    /**
     * @constant {string}
     * @static
     */
    static get PLURAL_NAME()
    {
        return 'pluralName';
    }

    /**
     * @constant {array}
     * @static
     */
    static get ANY()
    {
        return ['longName', 'shortName', 'pluralName'];
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model.entity/EntityCategory';
    }


    /**
     * @inheritDocs
     */
    get fields()
    {
        const fields = super.fields;
        fields.longName = '';
        fields.shortName = '';
        fields.pluralName = '';
        fields.isGlobal = false;
        return fields;
    }


    /**
     * @inheritDocs
     */
    get uniqueId()
    {
        return this._longName + this._isGlobal;
    }


    /**
     * @property {String}
     */
    get longName()
    {
        return this._longName;
    }

    set longName(value)
    {
        this._longName = value;
    }


    /**
     * @property {String}
     */
    get shortName()
    {
        return this._shortName;
    }

    set shortName(value)
    {
        this._shortName = value;
    }


    /**
     * @property {String}
     */
    get pluralName()
    {
        return this._pluralName;
    }

    set pluralName(value)
    {
        this._pluralName = value;
    }


    /**
     * @property {Bool}
     */
    get isGlobal()
    {
        return this._isGlobal;
    }

    set isGlobal(value)
    {
        this._isGlobal = value;
    }


    /**
     * @inheritDocs
     */
    dehydrate(values)
    {
        super.dehydrate(values);
        if (!this.pluralName.length)
        {
            this.pluralName = this.longName + 's';
        }
        if (!this.shortName.length)
        {
            this.shortName = this.longName.substr(0, 1).toLowerCase();
        }
    }


    /**
     * @inheritDocs
     */
    toString()
    {
        return `[${this.className} ${this.longName}]`;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EntityCategory = EntityCategory;
