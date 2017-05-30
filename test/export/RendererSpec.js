'use strict';

/**
 * Requirements
 */
const Renderer = require(ES_SOURCE + '/export/Renderer.js').Renderer;
const rendererSpec = require('./RendererShared.js').spec;


/**
 * Spec
 */
describe(Renderer.className, function()
{
    /**
     * Renderer Test
     */
    rendererSpec(Renderer, 'export/Renderer');
});
