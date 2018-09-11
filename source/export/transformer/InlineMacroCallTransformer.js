'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeTransformer = require('./NodeTransformer.js').NodeTransformer;
const DecorateVariableNameTransformer = require('./DecorateVariableNameTransformer.js')
    .DecorateVariableNameTransformer;
const PreferYieldTransformer = require('./PreferYieldTransformer.js').PreferYieldTransformer;
const NodeList = require('../ast/NodeList.js').NodeList;
const SetNode = require('../ast/SetNode.js').SetNode;
const VariableNode = require('../ast/VariableNode.js').VariableNode;
const metrics = require('../../utils/performance.js').metrics;
const co = require('co');

/**
 * Unique Id
 */
let uniqueId = 1;

/**
 * Reset the unique id (use this only for testing purposes)
 */
function resetUniqueId() {
    uniqueId = 1;
}

/**
 *
 */
class InlineMacroCallTransformer extends NodeTransformer {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'export.transformer/InlineMacroCallTransformer';
    }

    /**
     * @param {export.ast.CallNode} callNode
     * @param {export.ast.MacroNode} macroNode
     * @param {Object} macroConfiguration
     * @param {export.JspConfiguration} configuration
     * @return {mixed}
     */
    prepareParameters(callNode, macroNode, macroConfiguration, configuration) {
        const parameters = {};

        // Add macro values
        for (const parameter of macroNode.parameters) {
            parameters[parameter.name] = {
                name: parameter.name,
                value: parameter.value
            };
        }

        // Add call values
        for (const parameter of callNode.arguments) {
            parameters[parameter.name].value = parameter.value;
        }

        return parameters;
    }

    /**
     * @inheritDocs
     * @todo Handle extended / override macros
     */
    transformNode(node, configuration) {
        const scope = this;
        const promise = co(function*() {
            metrics.start(scope.className + '::transformNode');

            // inline call nodes
            if (node.is('CallNode') && configuration) {
                // See if call needs to be inlined
                const macroConfiguration = yield configuration.getMacroConfiguration(node.name);
                if (
                    macroConfiguration.mode === 'inline' ||
                    (node.children && node.children.length)
                ) {
                    scope.logger.info('transformNode - inlining macro ' + node.name);

                    // Prepare
                    const suffix = '_u' + uniqueId++;
                    const rootNode = new NodeList();

                    // Get called macro
                    const macroNode = yield configuration.parser.parseMacro(
                        node.name,
                        configuration
                    );

                    // Add parameters as set's
                    const parameters = scope.prepareParameters(
                        node,
                        macroNode,
                        macroConfiguration,
                        configuration
                    );
                    for (const parameterName in parameters) {
                        const variableNode = new VariableNode({ fields: [parameterName + suffix] });
                        const setNode = new SetNode({
                            variable: variableNode,
                            value: parameters[parameterName].value
                        });
                        rootNode.children.push(setNode);
                    }

                    // Make variables unique
                    const variablesTransformer = new DecorateVariableNameTransformer({
                        suffix: suffix
                    });
                    let preparedMacro = yield variablesTransformer.transform(
                        macroNode,
                        configuration
                    );

                    // Add children to yield?
                    if (node.children && node.children.length) {
                        const yieldNode = preparedMacro.find('YieldNode');
                        if (yieldNode) {
                            const yieldNodes = new NodeList({ children: node.children });
                            preparedMacro.replace(yieldNode, yieldNodes);

                            const preferYieldTransformer = new PreferYieldTransformer();
                            preparedMacro = yield preferYieldTransformer.transform(
                                preparedMacro,
                                configuration
                            );
                        }
                    }

                    // Transform macro
                    preparedMacro = yield configuration.transformer.transform(
                        preparedMacro,
                        configuration
                    );

                    // Add macro body to list
                    rootNode.children.load(preparedMacro.children);

                    // Done
                    return rootNode;
                }
            }

            metrics.stop(scope.className + '::transformNode');
            return node;
        });
        return promise;
    }

    /**
     * @inheritDocs
     */
    reset(configuration) {
        resetUniqueId();
        return Promise.resolve();
    }
}

module.exports.InlineMacroCallTransformer = InlineMacroCallTransformer;
module.exports.resetUniqueId = resetUniqueId;
