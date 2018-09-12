'use strict';
/* eslint no-cond-assign:0 */

/**
 * Requirements
 * @ignore
 */
const Parser = require('../Parser.js').Parser;
const ErrorHandler = require('../../error/ErrorHandler.js').ErrorHandler;
const DocBlockParser = require('./DocBlockParser.js').DocBlockParser;
const DocumentationCallable = require('../../model/documentation/DocumentationCallable.js')
    .DocumentationCallable;
const DocumentationParameter = require('../../model/documentation/DocumentationParameter.js')
    .DocumentationParameter;
const ContentType = require('../../model/ContentType.js').ContentType;
const ContentKind = require('../../model/ContentKind.js').ContentKind;
const Dependency = require('../../model/documentation/Dependency.js').Dependency;
const DependencyType = require('../../model/documentation/DependencyType.js').DependencyType;
const trimMultiline = require('../../utils/string.js').trimMultiline;
const co = require('co');
const nunjucks = require('nunjucks');

/**
 * A jinja to documentation parser
 */
class JinjaParser extends Parser {
    /**
     * @param {Object} options
     */
    constructor(options) {
        super(options);

        // Assign options
        this._parser = new DocBlockParser();
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'parser.documentation/JinjaParser';
    }

    /**
     * @param {string} content
     * @returns {Promise<Array>}
     */
    tokenize(content) {
        const ast = nunjucks.lexer.lex(content);
        const result = [];
        let t;
        let block;
        let variable;
        while ((t = ast.nextToken())) {
            //console.log(t);
            switch (t.type) {
                case 'comment':
                    const comment = {
                        type: 'comment',
                        comment: t.value
                    };
                    result.push(comment);
                    break;

                case 'variable-start':
                    variable = {
                        type: false,
                        name: false
                    };
                    break;

                case 'variable-end':
                    variable = false;
                    break;

                case 'left-paren':
                    if (variable && variable.name) {
                        variable.type = 'call';
                        result.push(variable);
                    }
                    variable = false;
                    break;

                case 'block-start':
                    block = {
                        type: false,
                        name: false,
                        arguments: []
                    };
                    break;

                case 'block-end':
                    if (
                        block &&
                        (block.type == 'include' || block.type == 'macro' || block.type == 'call')
                    ) {
                        result.push(block);
                    }
                    block = false;
                    break;

                case 'symbol':
                    if (variable) {
                        variable.name = t.value;
                    }
                    if (block) {
                        if (!block.type) {
                            block.type = t.value;
                        } else if (block.type == 'macro' && !block.name) {
                            block.name = t.value;
                        } else if (block.type == 'call' && !block.name) {
                            block.name = t.value;
                        } else if (block.arguments) {
                            block.arguments.push({
                                name: t.value,
                                type: '*',
                                value: undefined
                            });
                        }
                    }
                    break;

                case 'int':
                case 'string':
                case 'boolean':
                    if (block) {
                        if (block.type == 'macro' && block.arguments.length) {
                            let value = t.value;
                            if (t.type == 'string') {
                                value = "'" + value + "'";
                            }
                            block.arguments[block.arguments.length - 1].type = t.type;
                            block.arguments[block.arguments.length - 1].value = value;
                        } else if (block.type == 'include') {
                            block.include = t.value;
                        }
                    }
                    break;

                default:
                    //console.log(t);
                    break;
            }
        }

        return Promise.resolve(result);
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
            const result = [];
            const contents = trimMultiline(content, [{ start: '{##', end: '#}' }]);
            const tokens = yield scope.tokenize(contents);

            // Parse
            let comment = false;
            let documentation = false;
            for (const token of tokens) {
                switch (token.type) {
                    case 'comment':
                        comment = token.comment;
                        break;

                    case 'call':
                        if (documentation) {
                            if (
                                !documentation.dependencies.findBy({
                                    name: token.name,
                                    type: DependencyType.MACRO
                                })
                            ) {
                                const dependency = new Dependency({
                                    name: token.name,
                                    type: DependencyType.MACRO
                                });
                                documentation.dependencies.push(dependency);
                            }
                        }
                        break;

                    case 'macro':
                        // Do we have a docblock?
                        if (comment) {
                            documentation = yield scope._parser.parse(comment, {
                                hint: 'callable',
                                contentType: ContentType.JINJA
                            });
                            comment = false;
                        } else {
                            documentation = new DocumentationCallable();
                        }

                        //console.log(documentation, token);
                        if (documentation instanceof DocumentationCallable) {
                            documentation.contentType = ContentType.JINJA;
                            documentation.contentKind = ContentKind.MACRO;
                            documentation.name = token.name;

                            // Update with arguments
                            const order = [];
                            for (const argument of token.arguments) {
                                order.push(argument.name);
                                let parameter = documentation.parameters.find(
                                    (item) => item.name === argument.name
                                );
                                if (!parameter) {
                                    parameter = new DocumentationParameter();
                                    parameter.name = argument.name;
                                    parameter.type = [DocBlockParser.mapType()];
                                    documentation.parameters.push(parameter);
                                }
                                if (argument.value && !parameter.defaultValue) {
                                    parameter.defaultValue = argument.value;
                                }
                            }

                            // Ensure correct order
                            const parameters = documentation.parameters.slice(0);
                            documentation.parameters = [];
                            for (const name of order) {
                                documentation.parameters.push(
                                    parameters.find((item) => item.name === name)
                                );
                            }

                            result.push(documentation);
                        }
                        break;

                    default:
                        comment = false;
                        break;
                }
            }

            return result;
        }).catch(ErrorHandler.handler(scope));

        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.JinjaParser = JinjaParser;
