'use strict';

/**
 * Requirements
 */
const AnyNodeRenderer = require(ES_SOURCE + '/export/renderer/AnyNodeRenderer.js').AnyNodeRenderer;
const nodeRendererSpec = require('./NodeRendererShared.js').spec;


/**
 * Spec
 */
describe(AnyNodeRenderer.className, function()
{
    /**
     * NodeRenderer Test
     */
    nodeRendererSpec(AnyNodeRenderer, 'export.renderer/AnyNodeRenderer');
});
