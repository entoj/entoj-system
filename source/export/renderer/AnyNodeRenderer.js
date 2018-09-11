'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeRenderer = require('./NodeRenderer.js').NodeRenderer;
const BaseArray = require('../../base/BaseArray.js').BaseArray;
const Node = require('../ast/Node.js').Node;
const co = require('co');

/**
 * Renders every node it gets
 *
 * @memberOf export.renderer
 * @extends Base
 */
class AnyNodeRenderer extends NodeRenderer {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'export.renderer/AnyNodeRenderer';
    }

    /**
     * @inheritDocs
     */
    willRender(node, parameters) {
        return Promise.resolve(true);
    }

    /**
     * @inheritDocs
     */
    render(node, configuration) {
        if (!node || !configuration) {
            return Promise.resolve('');
        }
        if (node.is('TextNode')) {
            return Promise.resolve(node.value);
        }
        const promise = co(function*() {
            let result = '';
            for (const iterableField of node.iterableFields) {
                const iterable = node[iterableField];
                if (iterable instanceof BaseArray) {
                    result += yield configuration.renderer.renderList(iterable, configuration);
                } else if (iterable instanceof Node) {
                    result += yield configuration.renderer.renderNode(iterable, configuration);
                }
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
module.exports.AnyNodeRenderer = AnyNodeRenderer;
