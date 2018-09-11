'use strict';

/**
 * Requirements
 * @ignore
 */
const CallableNode = require('./CallableNode.js').CallableNode;

/**
 * A custom tag call
 */
class TagNode extends CallableNode {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'export.ast/TagNode';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.TagNode = TagNode;
