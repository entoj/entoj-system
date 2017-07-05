'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeTransformer = require('./NodeTransformer.js').NodeTransformer;
const DecorateVariableNameTransformer = require('./DecorateVariableNameTransformer.js').DecorateVariableNameTransformer;
const NodeList = require('../ast/NodeList.js').NodeList;
const SetNode = require('../ast/SetNode.js').SetNode;
const VariableNode = require('../ast/VariableNode.js').VariableNode;
const co = require('co');


/**
 * Unique Id
 */
let uniqueId = 1;


/**
 * Reset the unique id (use this only for testing purposes)
 */
function resetUniqueId()
{
    uniqueId = 1;
}


/**
 *
 */
class InlineMacroCallTransformer extends NodeTransformer
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.transformer/InlineMacroCallTransformer';
    }


    /**
     * @inheritDocs
     * @todo Handle extended / override macros
     */
    transformNode(node, configuration)
    {
        const scope = this;
        const promise = co(function*()
        {
            // inline call nodes
            if (node.is('CallNode') && configuration)
            {
                // See if call needs to be inlined
                const macroSettings = yield configuration.getMacroConfiguration(node.name);
                if (macroSettings.mode === 'inline')
                {
                    scope.logger.info('transformNode - inlining macro ' + node.name);

                    // Prepare
                    const suffix = '_u' + (uniqueId++);
                    const rootNode = new NodeList();

                    // Get called macro
                    const rawMacroNode = yield configuration.parser.parseMacro(node.name, configuration);
                    const macroNode = yield configuration.transformer.transform(rawMacroNode, configuration);

                    // Add parameters as set's
                    for (const parameter of macroNode.parameters)
                    {
                        const variableNode = new VariableNode({ fields: [parameter.name + suffix] });
                        const callArgument = node.arguments.find((arg) => arg.name == parameter.name);
                        const setNode = new SetNode({ variable: variableNode, value: callArgument ? callArgument.value : parameter.value });
                        rootNode.children.push(setNode);
                    }

                    // Make variables unique
                    const variablesTransformer = new DecorateVariableNameTransformer({ suffix: suffix });
                    const preparedMacro = yield variablesTransformer.transform(macroNode, configuration);

                    // Add children to yield?
                    if (node.children && node.children.length)
                    {
                        const yieldNode = preparedMacro.find('YieldNode');
                        if (yieldNode)
                        {
                            const yieldNodes = new NodeList();
                            yieldNodes.children.load(node.children);
                            preparedMacro.replace(yieldNode, yieldNodes);
                        }
                    }

                    // Add macro body to list
                    rootNode.children.load(preparedMacro.children);

                    // Done
                    return rootNode;
                }
            }
            return node;
        });
        return promise;
    }
}

module.exports.InlineMacroCallTransformer = InlineMacroCallTransformer;
module.exports.resetUniqueId = resetUniqueId;
