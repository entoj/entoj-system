'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueObject = require('../ValueObject.js').ValueObject;
const ContentType = require('../ContentType.js').ContentType;
const ContentKind = require('../ContentKind.js').ContentKind;

/**
 * @memberOf model.linter
 * @extends {model.ValueObject}
 */
class LinterResult extends ValueObject {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'model.linter/LinterResult';
    }

    /**
     * @inheritDoc
     */
    get fields() {
        const fields = super.fields;
        fields.site = false;
        fields.linter = '';
        fields.contentType = ContentType.ANY;
        fields.contentKind = ContentKind.UNKNOWN;
        fields.success = false;
        fields.warningCount = 0;
        fields.errorCount = 0;
        fields.messages = [];
        return fields;
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

    /**
     * @property {String}
     */
    get linter() {
        return this._linter;
    }

    set linter(value) {
        this._linter = value;
    }

    /**
     * @type {String}
     */
    get contentType() {
        return this._contentType;
    }

    set contentType(value) {
        this._contentType = value;
    }

    /**
     * @type {String}
     * @see model.ContentType
     */
    get contentKind() {
        return this._contentKind;
    }

    set contentKind(value) {
        this._contentKind = value;
    }

    /**
     * @type {Boolean}
     */
    get success() {
        return this._success;
    }

    set success(value) {
        this._success = value;
    }

    /**
     * @type {Number}
     */
    get warningCount() {
        return this._warningCount;
    }

    set warningCount(value) {
        this._warningCount = value;
    }

    /**
     * @type {Number}
     */
    get errorCount() {
        return this._errorCount;
    }

    set errorCount(value) {
        this._errorCount = value;
    }

    /**
     * @type {Array}
     */
    get messages() {
        return this._messages;
    }

    set messages(value) {
        this._messages = value;
    }

    /**
     * @inheritDoc
     */
    toString() {
        return `[${this.className} ${this.linter}]`;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.LinterResult = LinterResult;
