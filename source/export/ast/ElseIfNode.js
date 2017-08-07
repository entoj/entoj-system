'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeList = require('./NodeList.js').NodeList;
const Node = require('./Node.js').Node;


/**
 * The elseif part of a if
 */
class ElseIfNode extends NodeList
{
    /**
     * @ignore
     */
    constructor(values)
    {
        super(values);

        //condition
        this.dataFields.push('condition');
        this.iterableFields.unshift('condition');
        if (values && values.condition)
        {
            this.condition = values.condition;
        }
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.ast/ElseIfNode';
    }


    /**
     * @property {Node}
     */
    get condition()
    {
        return this._condition;
    }

    set condition(value)
    {
        if (this._condition && this._condition instanceof Node)
        {
            this._condition.parent = false;
        }
        this._condition = value;
        if (this._condition && this._condition instanceof Node)
        {
            this._condition.parent = this;
        }
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ElseIfNode = ElseIfNode;
