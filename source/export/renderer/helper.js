'use strict';

/**
 * Requirements
 * @ignore
 */
const waitForPromise = require('../../utils/synchronize.js').waitForPromise;
const ErrorHandler = require('../../error/ErrorHandler.js').ErrorHandler;
const trimQuotes = require('../../utils/string.js').trimQuotes;
const Node = require('../ast/Node.js').Node;
const LiteralNode = require('../ast/LiteralNode.js').LiteralNode;
const co = require('co');

/**
 * @param {Object} parameters
 * @param {export.JspConfiguration} configuration
 * @return {Promise<Object>}
 */
function convertToNodes(parameters, configuration) {
    const result = parameters;
    for (const parameterName in result) {
        if (!(result[parameterName].value instanceof Node)) {
            let value = parameters[parameterName].value;
            if (typeof value === 'string') {
                value = trimQuotes(value);
            }
            result[parameterName].value = new LiteralNode({ value: value });
        }
    }
    return Promise.resolve(result);
}

/**
 * @param {Object} parameters
 * @param {export.JspConfiguration} configuration
 * @return {Promise<Object>}
 */
function convertToLiterals(parameters, configuration) {
    const promise = co(function*() {
        const result = parameters;
        for (const parameterName in result) {
            const parameter = result[parameterName];
            if (parameter.value instanceof Node) {
                parameter.value = yield configuration.renderer.renderNode(
                    parameter.value,
                    configuration
                );
            } else if (
                typeof parameter.value === 'string' &&
                parameter.type &&
                (parameter.type.indexOf('Enumeration') > -1 ||
                    parameter.type.indexOf('String') > -1)
            ) {
                parameter.value = '\'' + parameter.value + '\'';
            }
        }
        return result;
    });
    return promise;
}

/**
 * @param {Mixed} value
 * @param {Array} type
 * @return {String}
 */
function prepareValue(value, type) {
    let result = value;
    if (type && type.indexOf('Boolean') > -1) {
        result = value === 'true' || value === true;
    }
    if (type && type.indexOf('Number') > -1) {
        result = parseFloat(value);
    }
    if (type && type.indexOf('String') > -1) {
        result = value ? trimQuotes(value.toString()) : '';
    }
    if (type && type.indexOf('Enumeration') > -1) {
        result = value ? trimQuotes(value.toString()) : null;
    }
    if (value === null || value === 'null' || typeof value === 'undefined') {
        result = null;
    }
    if ((value === false || value === 'false') && type && type.indexOf('Boolean') === -1) {
        result = null;
    }
    return result;
}

/**
 * @param {Object} macroConfiguration
 * @return {Object}
 */
function prepareDocumentedParameters(macroConfiguration) {
    const parameters = {};

    // Get default parameters from docblock
    if (macroConfiguration && macroConfiguration.macro) {
        for (const parameter of macroConfiguration.macro.parameters) {
            parameters[parameter.name] = {
                name: parameter.name,
                type: parameter.type,
                value: prepareValue(parameter.defaultValue, parameter.type)
            };
        }
    }

    return parameters;
}

/**
 * @param {export.ast.Node} node
 * @param {Object} macroConfiguration
 * @param {export.JspConfiguration} configuration
 * @param {String} resultType
 * @return {mixed}
 */
function prepareParameters(node, macroConfiguration, configuration, resultType) {
    const scope = this;
    const promise = co(function*() {
        let result = prepareDocumentedParameters(macroConfiguration);

        // Add parsed default values
        for (const parameter of node.parameters) {
            result[parameter.name] = result[parameter.name] || {};
            const type = result[parameter.name] ? result[parameter.name].type : [];
            const defaultValue = parameter.value
                ? yield configuration.renderer.renderNode(parameter.value, configuration)
                : undefined;
            result[parameter.name].value = prepareValue(defaultValue, type);
        }

        // Override configured arguments
        if (macroConfiguration.parameters) {
            for (const parameter in macroConfiguration.parameters) {
                result[parameter] = result[parameter] || {};
                const type = result[parameter].type ? result[parameter].type : [];
                const name =
                    typeof macroConfiguration.parameters[parameter] === 'object'
                        ? macroConfiguration.parameters[parameter].name
                        : parameter;
                const value =
                    typeof macroConfiguration.parameters[parameter] === 'object'
                        ? macroConfiguration.parameters[parameter].value
                        : macroConfiguration.parameters[parameter];
                if (typeof value !== 'undefined') {
                    result[parameter].value = new LiteralNode({ value: prepareValue(value, type) });
                }
                if (typeof name !== 'undefined') {
                    result[name] = result[parameter];
                    delete result[parameter];
                }
            }
        }

        // Prepare result
        result =
            resultType === 'nodes'
                ? yield convertToNodes(result, configuration)
                : yield convertToLiterals(result, configuration);
        return result;
    }).catch(ErrorHandler.handler(scope));
    return waitForPromise(promise);
}

/**
 * @return {Promise<Array>}
 */
function prepareArguments(node, macroConfiguration, configuration, resultType) {
    const scope = this;
    const promise = co(function*() {
        let result = prepareDocumentedParameters(macroConfiguration);

        // Get arguments
        for (const argument of node.arguments) {
            const name =
                typeof argument.name !== 'undefined'
                    ? argument.name
                    : node.arguments.indexOf(argument);
            result[name] = result[name] || {};
            result[name].value = argument.value;
        }

        // Get overrides
        if (macroConfiguration && macroConfiguration.arguments) {
            for (const argument in macroConfiguration.arguments) {
                result[argument] = result[argument] || {};
                const type = result[argument] ? result[argument].type : [];
                result[argument].value = prepareValue(macroConfiguration.arguments[argument], type);
            }
        }

        // Prepare result
        result =
            resultType === 'nodes'
                ? yield convertToNodes(result, configuration)
                : yield convertToLiterals(result, configuration);
        return result;
    }).catch(ErrorHandler.handler(scope));
    return waitForPromise(promise);
}

/**
 * Public API
 */
module.exports.prepareParameters = prepareParameters;
module.exports.prepareArguments = prepareArguments;
