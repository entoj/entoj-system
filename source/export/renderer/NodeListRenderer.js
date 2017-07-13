'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeRenderer = require('./NodeRenderer.js').NodeRenderer;


/**
 * Renders all children of a NodeList
 *
 * @memberOf export.renderer
 * @extends Base
 */
class NodeListRenderer extends NodeRenderer
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.renderer/NodeListRenderer';
    }


    /**
     * @inheritDocs
     */
    willRender(node, configuration)
    {
        return Promise.resolve(node && node.is('NodeList'));
    }


    /**
     * @inheritDocs
     */
    render(node, configuration)
    {
        if (!node)
        {
            return Promise.resolve('');
        }
        return configuration.renderer.renderList(node.children, configuration);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.NodeListRenderer = NodeListRenderer;
