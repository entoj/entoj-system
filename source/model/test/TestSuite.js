'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueObject = require('../ValueObject.js').ValueObject;
const SearchableArray = require('../../base/SearchableArray.js').SearchableArray;

/**
 * Describes a Test suite
 *
 * @memberOf model.test
 * @extends Base
 */
class TestSuite extends ValueObject {
    /**
     * @inheritDocs
     */
    static get className() {
        return 'model.test/TestSuite';
    }

    /**
     * @inheritDocs
     */
    get fields() {
        const fields = super.fields;
        fields.name = '';
        fields.site = false;
        fields.isValid = false;
        fields.ok = 0;
        fields.failed = 0;
        fields.tests = SearchableArray;
        return fields;
    }

    /**
     * @property {String}
     */
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    /**
     * @property {Boolean}
     */
    get isValid() {
        return this._isValid;
    }

    set isValid(value) {
        this._isValid = value;
    }

    /**
     * @property {Number}
     */
    get ok() {
        return this._ok;
    }

    set ok(value) {
        this._ok = value;
    }

    /**
     * @property {Number}
     */
    get failed() {
        return this._failed;
    }

    set failed(value) {
        this._failed = value;
    }

    /**
     * @property {Array}
     */
    get tests() {
        return this._tests;
    }

    set tests(value) {
        this._tests = value;
    }

    /**
     * @property {model.site.Site}
     */
    get site() {
        return this._site;
    }

    set site(value) {
        this._site = value;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.TestSuite = TestSuite;
