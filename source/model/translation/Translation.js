'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueObject = require('../ValueObject.js').ValueObject;


/**
 * Describes a Translation
 *
 * @memberOf model.translation
 */
class Translation extends ValueObject
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
     * @inheritDoc
     */
    get fields()
    {
        const fields = super.fields;
        fields.name = '';
        fields.value = {};
        fields.site = false;
        return fields;
    }


    /**
     * @inheritDoc
     */
    initialize()
    {
        super.initialize();
        this._name = '';
        this._value = {};
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.translation/Translation';
    }


    /**
     * @inheritDoc
     */
    get uniqueId()
    {
        return (this.site)
            ? this.site.name + ':' + this.name
            : this.name;
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
     * @inheritDoc
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
module.exports.Translation = Translation;
