'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeList = require('./NodeList.js').NodeList;

/**
 * A group of expressions (....)
 */
class GroupNode extends NodeList {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'export.ast/GroupNode';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.GroupNode = GroupNode;
