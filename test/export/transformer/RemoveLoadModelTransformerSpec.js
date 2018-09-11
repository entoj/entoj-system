'use strict';

/**
 * Requirements
 */
const RemoveLoadModelTransformer = require(ES_SOURCE +
    '/export/transformer/RemoveLoadModelTransformer.js').RemoveLoadModelTransformer;
const nodeTransformerSpec = require(ES_TEST + '/export/transformer/NodeTransformerShared.js').spec;

describe(RemoveLoadModelTransformer.className, function() {
    /**
     * NodeTransformer Test
     */
    const options = {
        basePath: ES_FIXTURES + '/export/transformer'
    };
    const testFixtures = {
        'should remove {% set model = ... %}': 'RemoveLoadModelTransformer'
    };
    nodeTransformerSpec(
        RemoveLoadModelTransformer,
        'export.transformer/RemoveLoadModelTransformer',
        undefined,
        testFixtures,
        options
    );
});
