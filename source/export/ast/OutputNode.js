'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeList = require('./NodeList.js').NodeList;

/**
 *
 */
class OutputNode extends NodeList {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'export.ast/OutputNode';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.OutputNode = OutputNode;
