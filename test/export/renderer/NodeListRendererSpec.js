'use strict';

/**
 * Requirements
 */
const NodeListRenderer = require(ES_SOURCE + '/export/renderer/NodeListRenderer.js').NodeListRenderer;
const nodeRendererSpec = require('./NodeRendererShared.js').spec;


/**
 * Spec
 */
describe(NodeListRenderer.className, function()
{
    /**
     * NodeRenderer Test
     */
    nodeRendererSpec(NodeListRenderer, 'export.renderer/NodeListRenderer');
});
