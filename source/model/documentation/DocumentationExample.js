'use strict';

/**
 * Requirements
 * @ignore
 */
const Documentation = require('./Documentation.js').Documentation;
const ContentKind = require('../ContentKind.js').ContentKind;

/**
 * @memberOf model.documentation
 */
class DocumentationExample extends Documentation {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'model.documentation/DocumentationExample';
    }

    /**
     * @inheritDocs
     */
    get fields() {
        const fields = super.fields;
        fields.contentKind = ContentKind.EXAMPLE;
        return fields;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.DocumentationExample = DocumentationExample;
