'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeRenderer = require('./NodeRenderer.js').NodeRenderer;


/**
 * Renders a simple TextNode
 *
 * @memberOf export.renderer
 * @extends Base
 */
class TextNodeRenderer extends NodeRenderer
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.renderer/TextNodeRenderer';
    }


    /**
     * @inheritDocs
     */
    willRender(node, configuration)
    {
        return Promise.resolve(node && node.is('TextNode'));
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
        return Promise.resolve(node.value);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.TextNodeRenderer = TextNodeRenderer;
