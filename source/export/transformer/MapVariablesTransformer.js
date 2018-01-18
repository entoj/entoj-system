'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeTransformer = require('./NodeTransformer.js').NodeTransformer;
const co = require('co');


/**
 * Maps variables to specified variable names.
 * The mapping is configured via export.settings.[exporter].parameterMapping
 */
class MapVariablesTransformer extends NodeTransformer
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.transformer/MapVariablesTransformer';
    }


    /**
     * @inheritDoc
     */
    transformNode(node, configuration)
    {
        const scope = this;
        const promise = co(function*()
        {
            if (configuration && node.is('VariableNode'))
            {
                scope.logger.debug('transformNode - mapping variable ' + node.fields.join('.'));

                // Get config
                const macro = node.findParent('MacroNode');
                const macroConfiguration = yield configuration.getMacroConfiguration(macro.name);
                const variableName = node.fields.join('.');

                // Apply parameter mapping
                if (macroConfiguration &&
                    macroConfiguration.variables &&
                    macroConfiguration.variables[variableName])
                {
                    node.fields = macroConfiguration.variables[variableName].split('.');
                }
            }
            return node;
        });
        return promise;
    }
}

module.exports.MapVariablesTransformer = MapVariablesTransformer;
