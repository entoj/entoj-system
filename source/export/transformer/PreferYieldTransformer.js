'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeTransformer = require('./NodeTransformer.js').NodeTransformer;
const NodeList = require('../ast/NodeList.js').NodeList;
const metrics = require('../../utils/performance.js').metrics;

/**
 * Removes the else part of if caller then ... else ... constructs
 */
class PreferYieldTransformer extends NodeTransformer {
    /**
     * @inheritDocs
     */
    static get className() {
        return 'export.transformer/PreferYieldTransformer';
    }

    /**
     * @inheritDocs
     */
    transformNode(node, transformer, options) {
        metrics.start(this.className + '::transformNode');

        // Remove if caller|notempty then ...
        if (
            node.is('IfNode') &&
            node.condition.children.length &&
            node.condition.children[0].is('FilterNode') &&
            node.condition.children[0].name == 'notempty' &&
            node.condition.children[0].value &&
            node.condition.children[0].value.is('VariableNode') &&
            node.condition.children[0].value.fields.length === 1 &&
            node.condition.children[0].value.fields[0].startsWith('caller')
        ) {
            metrics.stop(this.className + '::transformNode');
            return Promise.resolve(new NodeList({ children: node.children }));
        }

        // Remove if caller then ...
        if (
            node.is('IfNode') &&
            node.condition.children.length == 1 &&
            node.condition.children[0].is('VariableNode') &&
            node.condition.children[0].fields.length === 1 &&
            node.condition.children[0].fields[0].startsWith('caller')
        ) {
            metrics.stop(this.className + '::transformNode');
            return Promise.resolve(new NodeList({ children: node.children }));
        }

        metrics.stop(this.className + '::transformNode');
        return Promise.resolve(node);
    }
}

module.exports.PreferYieldTransformer = PreferYieldTransformer;
