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
    const options =
    {
        basePath: ES_FIXTURES + '/export/nodeRenderer'
    };
    nodeRendererSpec(AnyNodeRenderer, 'export.renderer/AnyNodeRenderer', undefined, options);
});
