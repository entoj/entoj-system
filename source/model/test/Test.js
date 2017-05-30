'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueObject = require('../ValueObject.js').ValueObject;


/**
 * Describes a Test
 *
 * @memberOf model.test
 * @extends Base
 */
class Test extends ValueObject
{
    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model.test/Test';
    }


    /**
     * @inheritDocs
     */
    get fields()
    {
        const fields = super.fields;
        fields.name = '';
        fields.ok = 0;
        fields.failed = 0;
        fields.tests = [];
        fields.site = false;
        return fields;
    }


    /**
     * @property {String}
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
     * @property {Number}
     */
    get ok()
    {
        return this._ok;
    }

    set ok(value)
    {
        this._ok = value;
    }


    /**
     * @property {Number}
     */
    get failed()
    {
        return this._failed;
    }

    set failed(value)
    {
        this._failed = value;
    }


    /**
     * @property {Array}
     */
    get tests()
    {
        return this._tests;
    }

    set tests(value)
    {
        this._tests = value;
    }


    /**
     * @property {model.site.Site}
     */
    get site()
    {
        return this._site;
    }

    set site(value)
    {
        this._site = value;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Test = Test;
