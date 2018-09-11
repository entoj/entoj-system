'use strict';

/**
 * Requirements
 * @ignore
 */
const Parser = require('../Parser.js').Parser;
const DocBlockParser = require('./DocBlockParser.js').DocBlockParser;
const DocumentationExample = require('../../model/documentation/DocumentationExample.js')
    .DocumentationExample;
const ContentType = require('../../model/ContentType.js').ContentType;
const ContentKind = require('../../model/ContentKind.js').ContentKind;
const ErrorHandler = require('../../error/ErrorHandler.js').ErrorHandler;
const co = require('co');
const trimMultiline = require('../../utils/string.js').trimMultiline;

/**
 * A basic example to documentation parser
 */
class ExampleParser extends Parser {
    /**
     * @param {Object} options
     */
    constructor(options) {
        super(options);

        // Assign options
        this._parser = new DocBlockParser();
    }

    /**
     * @inheritDocs
     */
    static get className() {
        return 'parser.documentation/ExampleParser';
    }

    /**
     * @type {parser.Parser}
     */
    get parser() {
        return this._parser;
    }

    /**
     * @param {string} content
     * @param {string} options
     * @returns {Promise<Array>}
     */
    parse(content, options) {
        if (!content || content.trim() === '') {
            Promise.resolve(false);
        }

        const scope = this;
        const promise = co(function*() {
            // Prepare
            let result;
            const contentType = options
                ? options.contentType || ContentType.JINJA
                : ContentType.JINJA;
            const contents = trimMultiline(content, [{ start: '{##', end: '#}' }]);

            // Parse first docblock
            let exampleRegex;
            if (contentType == ContentType.JINJA) {
                exampleRegex = /\{##((.|[\r\n\s])*?)#\}/gi;
            } else {
                exampleRegex = /\/\*\*([^*]|[\r\n\s]|(\*+([^*/]|[\r\n\s])))*\*+\//gi;
            }
            const exampleMatch = exampleRegex.exec(contents);
            if (exampleMatch) {
                result = yield scope.parser.parse(exampleMatch[0], {
                    contentType: contentType,
                    hint: 'example'
                });
            } else {
                result = new DocumentationExample();
            }

            // Set kind
            result.contentKind = ContentKind.EXAMPLE;

            return result;
        }).catch(ErrorHandler.handler(scope));

        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ExampleParser = ExampleParser;
