'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;


/**
 * Base Node renderer
 *
 * @memberOf export.renderer
 * @extends Base
 */
class NodeRenderer extends Base
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.renderer/NodeRenderer';
    }


    /**
     * Resolve to true when the renderer want's to render the given node.
     *
     * @param {export.ast.Node} node
     * @param {export.Configuration} configuration
     * @return {Promise<Boolean>}
     */
    willRender(node, configuration)
    {
        return Promise.resolve(false);
    }


    /**
     * Resolve to true when no other renderer should be
     * allowed to render the given node.
     *
     * @param {export.ast.Node} node
     * @param {export.Configuration} configuration
     * @return {Promise<Boolean>}
     */
    shouldStopRendering(node, configuration)
    {
        return this.willRender(node, configuration);
    }


    /**
     * Render the given node to a string.
     *
     * @param {export.ast.Node} node
     * @param {export.Configuration} configuration
     * @return {Promise<String>}
     */
    render(node, configuration)
    {
        return Promise.resolve('');
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.NodeRenderer = NodeRenderer;
