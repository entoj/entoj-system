'use strict';

/**
 * Requirements
 */
const NodeRenderer = require(ES_SOURCE + '/export/renderer/NodeRenderer.js').NodeRenderer;
const nodeRendererSpec = require('./NodeRendererShared.js').spec;

/**
 * Spec
 */
describe(NodeRenderer.className, function() {
    /**
     * NodeRenderer Test
     */
    nodeRendererSpec(NodeRenderer, 'export.renderer/NodeRenderer');
});
