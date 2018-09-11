'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const NodeTransformer = require('./transformer/NodeTransformer.js').NodeTransformer;
const co = require('co');

/**
 * Applies NodeTransformer to a node.
 * Supports multiple passes.
 */
class Transformer extends Base {
    /**
     * @param {Array} nodeTransformers
     */
    constructor(nodeTransformers) {
        super();

        // Assign options
        this._nodeTransformers = [];
        if (nodeTransformers && Array.isArray(nodeTransformers) && nodeTransformers.length) {
            // Prepare passes
            const passes = !Array.isArray(nodeTransformers[1])
                ? [nodeTransformers]
                : nodeTransformers;

            // Add instances for each pass
            for (const pass of passes) {
                if (Array.isArray(pass)) {
                    const passInstances = [];
                    for (const nodeTransformer of pass) {
                        if (!(nodeTransformer instanceof NodeTransformer)) {
                            throw new Error(
                                this.className + ' expects a list of NodeTransformer instances'
                            );
                        }
                        passInstances.push(nodeTransformer);
                    }
                    this._nodeTransformers.push(passInstances);
                }
            }
        }
    }

    /**
     * @inheritDocs
     */
    static get injections() {
        return { parameters: ['export/Transformer.nodeTransformers'] };
    }

    /**
     * @inheritDocs
     */
    static get className() {
        return 'export/Transformer';
    }

    /**
     * @type {Array}
     */
    get nodeTransformers() {
        return this._nodeTransformers;
    }

    /**
     * Transforms a node.
     *
     * @param {export.ast.Node} node
     * @param {export.Configuration} configuration
     * @returns {Promise<String>}
     */
    transform(node, configuration) {
        const scope = this;
        const promise = co(function*() {
            let result = node;
            for (const pass of scope.nodeTransformers) {
                for (const nodeTransformer of pass) {
                    result = yield nodeTransformer.transform(result, configuration);
                }
            }
            return result;
        });
        return promise;
    }

    /**
     * Reset's the internal state of all transformers.
     *
     * @param {export.Configuration} configuration
     * @returns {Promise}
     */
    reset(configuration) {
        const scope = this;
        const promise = co(function*() {
            for (const pass of scope.nodeTransformers) {
                for (const nodeTransformer of pass) {
                    yield nodeTransformer.reset(configuration);
                }
            }
        });
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.Transformer = Transformer;
