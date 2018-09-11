'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeList = require('./NodeList.js').NodeList;

/**
 * Represents an array of arbitrary values
 */
class ArrayNode extends NodeList {
    /**
     * @inheritDocs
     */
    static get className() {
        return 'export.ast/ArrayNode';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ArrayNode = ArrayNode;
