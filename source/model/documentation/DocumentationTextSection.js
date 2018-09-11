'use strict';

/**
 * Requirements
 * @ignore
 */
const Documentation = require('./Documentation.js').Documentation;

/**
 * @memberOf model.documentation
 */
class DocumentationTextSection extends Documentation {
    /**
     *
     */
    static get DESCRIPTION() {
        return 'description';
    }

    /**
     *
     */
    static get FUNCTIONAL() {
        return 'functional';
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'model.documentation/DocumentationTextSection';
    }

    /**
     * @inheritDocs
     */
    get fields() {
        const fields = super.fields;
        fields.tokens = [];
        return fields;
    }

    /**
     * @property {Array}
     */
    get tokens() {
        return this._tokens;
    }

    set tokens(value) {
        this._tokens = value;
    }

    /**
     * @property {Array}
     */
    getTokens(skip) {
        return this._tokens.slice(skip || 0);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.DocumentationTextSection = DocumentationTextSection;
