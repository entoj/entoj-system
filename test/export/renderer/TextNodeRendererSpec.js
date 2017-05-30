'use strict';

/**
 * Requirements
 */
const TextNodeRenderer = require(ES_SOURCE + '/export/renderer/TextNodeRenderer.js').TextNodeRenderer;
const nodeRendererSpec = require('./NodeRendererShared.js').spec;


/**
 * Spec
 */
describe(TextNodeRenderer.className, function()
{
    /**
     * NodeRenderer Test
     */
    nodeRendererSpec(TextNodeRenderer, 'export.renderer/TextNodeRenderer');
});
