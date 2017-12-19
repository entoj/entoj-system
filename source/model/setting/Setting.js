'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueObject = require('../ValueObject.js').ValueObject;


/**
 * Describes a Setting
 *
 * @memberOf model.setting
 */
class Setting extends ValueObject
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
        fields.value = {};
        return fields;
    }


    /**
     * @inheritDocs
     */
    initialize()
    {
        super.initialize();
        this._name = '';
        this._value = {};
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model.setting/Setting';
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
    get value()
    {
        return this._value;
    }

    set value(value)
    {
        this._value = value;
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
module.exports.Setting = Setting;
