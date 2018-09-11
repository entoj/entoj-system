'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;
const Node = require('../ast/Node.js').Node;
const co = require('co');

/**
 * AST Transformer
 */
class NodeTransformer extends Base {
    /**
     * @inheritDocs
     */
    static get className() {
        return 'export.transformer/NodeTransformer';
    }

    /**
     * Transforms a single node
     *
     * @param {export.ast.Node} node
     * @param {export.Configuration} configuration
     */
    transformNode(node, configuration) {
        return Promise.resolve(node);
    }

    /**
     * Walks the node and it's children and applies transformation to each node.
     *
     * @private
     * @param {export.ast.Node} node
     * @param {Function} transformation
     * @param {export.Configuration} configuration
     * @param {Number} [level]
     */
    walk(node, transformation, configuration, level) {
        const scope = this;
        const promise = co(function*() {
            level = level || 0;
            scope.logger.debug(String('    ').repeat(level), 'Node', node.type);

            if (!(node instanceof Node)) {
                return node;
            }

            for (const field of node.iterableFields) {
                if (Array.isArray(node[field])) {
                    const nodes = [];
                    for (const child of node[field]) {
                        try {
                            const transformedNode = yield scope.walk(
                                child,
                                transformation,
                                configuration,
                                level + 1
                            );
                            if (transformedNode) {
                                nodes.push(transformedNode);
                            }
                        } catch (e) {
                            /* istanbul ignore next */
                            scope.logger.error('Walk failed for ', child, e);
                        }
                    }
                    node[field].load(nodes, true);
                } else if (node instanceof Node && node[field]) {
                    node[field] = yield scope.walk(
                        node[field],
                        transformation,
                        configuration,
                        level + 1
                    );
                }
            }
            const result = yield transformation(node, configuration);
            return result;
        });
        return promise;
    }

    /**
     * Applies all transformations to the node and it's children
     *
     * @param {export.ast.Node} node
     * @param {export.Configuration} configuration
     */
    transform(node, configuration) {
        if (!node || !(node instanceof Node)) {
            return Promise.resolve(false);
        }
        return this.walk(node.clone(), this.transformNode.bind(this), configuration);
    }

    /**
     * Reset's the state of the transformer
     *
     * @param {export.Configuration} configuration
     */
    reset(configuration) {
        return Promise.resolve();
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.NodeTransformer = NodeTransformer;
