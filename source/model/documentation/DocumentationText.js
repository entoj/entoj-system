'use strict';

/**
 * Requirements
 * @ignore
 */
const Documentation = require('./Documentation.js').Documentation;
const DocumentationTextSection = require('./DocumentationTextSection.js').DocumentationTextSection;
const ContentKind = require('../ContentKind.js').ContentKind;

/**
 * @memberOf model.documentation
 */
class DocumentationText extends Documentation {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'model.documentation/DocumentationText';
    }

    /**
     * @inheritDocs
     */
    get fields() {
        const fields = super.fields;
        fields.contentKind = ContentKind.TEXT;
        fields.sections = [];
        fields.tokens = [];
        delete fields.description;
        return fields;
    }

    /**
     * @property {Array}
     */
    get tokens() {
        return this._tokens;
    }

    set tokens(value) {
        this._tokens = Array.isArray(value) ? value : [value];
    }

    /**
     * @property {Array}
     */
    get sections() {
        return this._sections;
    }

    set sections(value) {
        this._sections = Array.isArray(value) ? value : [value];
    }

    /**
     * @param {string} name
     * @returns {DocumentationTextSection}
     */
    getByName(name) {
        if (!this.sections) {
            return false;
        }
        return this.sections.find((item) => item.name === name);
    }

    /**
     * @property {string}
     */
    get description() {
        return this.getByName(DocumentationTextSection.DESCRIPTION);
    }

    set description(value) {}

    /**
     * @property {string}
     */
    get functional() {
        return this.getByName(DocumentationTextSection.FUNCTIONAL);
    }

    /**
     * @property {Array}
     */
    getTokens(skip) {
        return this.tokens.slice(skip || 0);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.DocumentationText = DocumentationText;
