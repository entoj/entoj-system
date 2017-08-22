'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const renderers = require('./renderer/index.js');
const co = require('co');


/**
 * Artefact renderer
 *
 * @memberOf export
 * @extends Base
 */
class Renderer extends Base
{
    /**
     * @ignore
     */
    constructor(nodeRenderers, options)
    {
        super();
        this._options = options || {};
        this._nodeRenderers = [];

        //Default renderer
        this._nodeRenderers.push(new renderers.NodeListRenderer());

        // Custom renderer
        if (nodeRenderers && Array.isArray(nodeRenderers))
        {
            for (const nodeRenderer of nodeRenderers)
            {
                if (!(nodeRenderer instanceof renderers.NodeRenderer))
                {
                    throw new Error(this.className + ' expects a list of NodeRenderer instances');
                }
                this._nodeRenderers.push(nodeRenderer);
            }
        }
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'export/Renderer';
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': ['export/Renderer.nodeRenderers', 'export/Renderer.options'] };
    }


    /**
     * @type {Object}
     */
    get options()
    {
        return this._options;
    }


    /**
     * @type {Array}
     */
    get nodeRenderers()
    {
        return this._nodeRenderers;
    }


    /**
     * Renders any source code at the top of each rendering
     *
     * @protected
     * @param {export.Configuration} configuration
     * @returns {Promise<String>}
     */
    renderPreface(configuration)
    {
        return Promise.resolve('');
    }


    /**
     * Renders any source code at the bottom of each rendering
     *
     * @protected
     * @param {export.Configuration} configuration
     * @returns {Promise<String>}
     */
    renderPostface(configuration)
    {
        return Promise.resolve('');
    }


    /**
     * Renders the given node (and it's child nodes) to a string.
     *
     * It will ask all registered renderers if it "willRender" the
     * node. After a renderer wants to render that node it may allow other
     * renderes to process the current node by returning "false" when
     * asked for "shouldStopRendering".
     *
     * @param {export.ast.Node} node
     * @param {export.Configuration} configuration
     * @returns {Promise<String>}
     */
    renderNode(node, configuration)
    {
        if (!node)
        {
            return Promise.resolve('');
        }
        const scope = this;
        const promise = co(function*()
        {
            let result = '';
            let didRender = false;
            for (const renderer of scope.nodeRenderers)
            {
                const willRender = yield renderer.willRender(node, configuration);
                if (willRender)
                {
                    didRender = true;
                    result+= yield renderer.render(node, configuration);
                    const stopRendering = yield renderer.shouldStopRendering(node, configuration);
                    if (stopRendering)
                    {
                        return result;
                    }
                }
            }
            if (!didRender)
            {
                scope.logger.error('renderNode: No renderer found', node.serialize());
            }
            return result;
        });
        return promise;
    }


    /**
     * Renders a list of Nodes.
     *
     * @param {Array} list
     * @param {export.Configuration} configuration
     * @returns {Promise<String>}
     */
    renderList(list, configuration)
    {
        if (!list)
        {
            return Promise.resolve('');
        }
        const scope = this;
        const promise = co(function*()
        {
            let result = '';
            for (const item of list)
            {
                result+= yield scope.renderNode(item, configuration);
            }
            return result;
        });
        return promise;
    }


    /**
     * A central comment renderer
     *
     * @param {String} text
     * @param {export.Configuration} configuration
     * @returns {Promise<String>}
     */
    renderComment(text, configuration)
    {
        return Promise.resolve('<!-- ' + text + ' -->\n');
    }


    /**
     * Renders a node as source code
     *
     * @param {export.ast.Node} node
     * @param {export.Configuration} configuration
     * @returns {Promise<String>}
     */
    render(node, configuration)
    {
        if (!node)
        {
            return Promise.resolve('');
        }
        const scope = this;
        const promise = co(function*()
        {
            let source = '';
            source+= yield scope.renderPreface(configuration);
            source+= yield scope.renderNode(node, configuration);
            source+= yield scope.renderPostface(configuration);
            return source;
        });
        return promise;
    }


    /**
     * Reset's the internal state of all renderers.
     *
     * @param {export.Configuration} configuration
     * @returns {Promise}
     */
    reset(configuration)
    {
        const scope = this;
        const promise = co(function *()
        {
            for (const nodeRenderer of scope.nodeRenderers)
            {
                yield nodeRenderer.reset(configuration);
            }
        });
        return promise;
    }


    /**
     * Creates any additional files needed by node renderers or transformers.
     *
     * @returns {Promise<Array>}
     */
    createAdditionalFiles()
    {
        const scope = this;
        const promise = co(function *()
        {
            const result = [];
            for (const nodeRenderer of scope.nodeRenderers)
            {
                const files = yield nodeRenderer.createAdditionalFiles();
                result.push(...files);
            }
            return result;
        });
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Renderer = Renderer;
