'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeTransformer = require('./NodeTransformer.js').NodeTransformer;
const DecorateVariableNameTransformer = require('./DecorateVariableNameTransformer.js')
    .DecorateVariableNameTransformer;
const co = require('co');
const metrics = require('../../utils/performance.js').metrics;

/**
 * Maps parameters of a macro to specified paramter names.
 * The mapping is configured via export.settings.[exporter].parameters
 */
class MapParametersTransformer extends NodeTransformer {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'export.transformer/MapParametersTransformer';
    }

    /**
     * @inheritDoc
     */
    transformNode(node, configuration) {
        const scope = this;
        const promise = co(function*() {
            metrics.start(scope.className + '::transformNode');

            if (configuration && node.is('MacroNode')) {
                // Get config
                const macroConfiguration = yield configuration.getMacroConfiguration(node.name);
                if (!macroConfiguration) {
                    return node;
                }

                // Apply parameter mapping
                if (macroConfiguration && macroConfiguration.parameters) {
                    const mapping = {};
                    for (const parameterName in macroConfiguration.parameters) {
                        mapping[parameterName] = macroConfiguration.parameters[parameterName].name;
                    }

                    const variablesTransformer = new DecorateVariableNameTransformer({
                        mapping: mapping
                    });
                    const renamedNode = yield variablesTransformer.transform(node, configuration);
                    return renamedNode;
                }
            }

            metrics.stop(scope.className + '::transformNode');
            return node;
        });
        return promise;
    }
}

module.exports.MapParametersTransformer = MapParametersTransformer;
