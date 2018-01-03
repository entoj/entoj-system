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
class MapParametersTransformer extends NodeTransformer
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.transformer/MapParametersTransformer';
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

                // Apply variable mapping
                if (macroConfiguration &&
                    macroConfiguration.parameters &&
                    macroConfiguration.parameters[variableName] &&
                    macroConfiguration.parameters[variableName].name)
                {
                    node.fields = macroConfiguration.parameters[variableName].name.split('.');
                }
            }
            return node;
        });
        return promise;
    }
}

module.exports.MapParametersTransformer = MapParametersTransformer;
