'use strict';

/**
 * Requirements
 * @ignore
 */
const Node = require('./Node.js').Node;


/**
 * Provides a value attribute.
 *
 * @mixin
 */
const ValueNodeMixin = (target) => class extends target
{
    /**
     * @ignore
     */
    constructor(values)
    {
        super(values);

        //value
        this.dataFields.push('value');
        this.iterableFields.unshift('value');
        if (values && typeof values.value !== 'undefined')
        {
            this.value = values.value;
        }
    }


    /**
     * @property {Node}
     */
    get value()
    {
        return this._value;
    }

    set value(value)
    {
        if (this._value && this._value instanceof Node)
        {
            this._value.parent = false;
        }
        this._value = value;
        if (this._value && this._value instanceof Node)
        {
            this._value.parent = this;
        }
    }
};


/**
 * A node with a simple scalar value attribute.
 * This is a virtual node and should not be used directly.
 */
class ValueNode extends ValueNodeMixin(Node)
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.ast/ValueNode';
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ValueNodeMixin = ValueNodeMixin;
module.exports.ValueNode = ValueNode;
