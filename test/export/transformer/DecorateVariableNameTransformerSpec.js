'use strict';

/**
 * Requirements
 */
const DecorateVariableNameTransformer = require(ES_SOURCE +
    '/export/transformer/DecorateVariableNameTransformer.js').DecorateVariableNameTransformer;
const nodeTransformerSpec = require(ES_TEST + '/export/transformer/NodeTransformerShared.js').spec;

/**
 * Spec
 */
describe(DecorateVariableNameTransformer.className, function() {
    /**
     * NodeTransformer Test
     */
    const options = {
        basePath: ES_FIXTURES + '/export/transformer'
    };
    const testFixtures = {
        'should decorate variables': 'DecorateVariableNameTransformer'
    };
    const prepareParameters = function() {
        return [
            {
                prefix: 'pre_',
                suffix: '_suf',
                filter: (name) => name !== 'keep'
            }
        ];
    };
    nodeTransformerSpec(
        DecorateVariableNameTransformer,
        'export.transformer/DecorateVariableNameTransformer',
        prepareParameters,
        testFixtures,
        options
    );
});
