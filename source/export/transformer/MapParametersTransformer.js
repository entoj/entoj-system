'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeTransformer = require('./NodeTransformer.js').NodeTransformer;
const DecorateVariableNameTransformer = require('./DecorateVariableNameTransformer.js').DecorateVariableNameTransformer;
const co = require('co');


/**
 * Maps macro parameters to specified variable names.
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
     * @inheritDocs
     */
    transformNode(node, configuration)
    {
        const scope = this;
        const promise = co(function*()
        {
            if (configuration && node.is('MacroNode'))
            {
                scope.logger.info('transformNode - mapping parameters for ' + node.name);

                // Get config
                const macroConfiguration = yield configuration.getMacroConfiguration(node.name);
                if (!macroConfiguration.parameterMapping)
                {
                    return node;
                }

                // Change parameters
                for (const param of node.parameters)
                {
                    // See if variable needs to be mapped
                    if (macroConfiguration.parameterMapping[param.name])
                    {
                        param.name = macroConfiguration.parameterMapping[param.name];
                    }
                }

                // Change uses
                const variablesTransformer = new DecorateVariableNameTransformer({ mapping: macroConfiguration.parameterMapping });
                node = yield variablesTransformer.transform(node, configuration);
            }
            return node;
        });
        return promise;
    }
}

module.exports.MapParametersTransformer = MapParametersTransformer;
