'use strict';

/**
 * Requirements
 * @ignore
 */
const Node = require('./Node.js').Node;
const ValueNodeMixin = require('./ValueNode.js').ValueNodeMixin;

/**
 * Represents a variable assignment
 */
class SetNode extends ValueNodeMixin(Node) {
    /**
     * @ignore
     */
    constructor(values) {
        super(values);

        //variable
        this.dataFields.push('variable');
        this.iterableFields.push('variable');
        if (values && values.variable) {
            this.variable = values.variable;
        }
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'export.ast/SetNode';
    }

    /**
     * @property {Node}
     */
    get variable() {
        return this._variable;
    }

    set variable(value) {
        if (this._variable && this._variable instanceof Node) {
            this._variable.parent = false;
        }
        this._variable = value;
        if (this._variable && this._variable instanceof Node) {
            this._variable.parent = this;
        }
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.SetNode = SetNode;
