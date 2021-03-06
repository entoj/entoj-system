'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeList = require('./NodeList.js').NodeList;
const Node = require('./Node.js').Node;
const BaseArray = require('../../base/BaseArray.js').BaseArray;


/**
 *
 */
class IfNode extends NodeList
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

        //elseIfChildren
        this.dataFields.push('elseIfChildren');
        this.iterableFields.push('elseIfChildren');
        this.elseIfChildren = new BaseArray();
        if (values && values.elseIfChildren)
        {
            this.elseIfChildren.load(values.elseIfChildren);
        }

        //elseChildren
        this.dataFields.push('elseChildren');
        this.iterableFields.push('elseChildren');
        this.elseChildren = new BaseArray();
        if (values && values.elseChildren)
        {
            this.elseChildren.load(values.elseChildren);
        }
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.ast/IfNode';
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


    /**
     * @property {BaseArray}
     */
    get elseIfChildren()
    {
        return this._elseIfChildren;
    }

    set elseIfChildren(value)
    {
        if (!this.elseIfChildrenChangeHandler)
        {
            this.elseIfChildrenChangeHandler = this.handleElseIfChildrenChange.bind(this);
        }
        if (this._elseIfChildren)
        {
            this._elseIfChildren.events.removeListener('change', this.elseIfChildrenChangeHandler);
        }
        this._elseIfChildren = value;
        if (this._elseIfChildren)
        {
            this._elseIfChildren.events.on('change', this.elseIfChildrenChangeHandler);
        }
    }


    /**
     * Updates parent property of all nodes
     */
    handleElseIfChildrenChange(collection)
    {
        for (const node of this.elseIfChildren)
        {
            node.parent = this;
        }
    }


    /**
     * @property {BaseArray}
     */
    get elseChildren()
    {
        return this._elseChildren;
    }

    set elseChildren(value)
    {
        if (!this.elseChildrenChangeHandler)
        {
            this.elseChildrenChangeHandler = this.handleElseChildrenChange.bind(this);
        }
        if (this._elseChildren)
        {
            this._elseChildren.events.removeListener('change', this.elseChildrenChangeHandler);
        }
        this._elseChildren = value;
        if (this._elseChildren)
        {
            this._elseChildren.events.on('change', this.elseChildrenChangeHandler);
        }
    }


    /**
     * Updates parent property of all nodes
     */
    handleElseChildrenChange(collection)
    {
        for (const node of this.elseChildren)
        {
            node.parent = this;
        }
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.IfNode = IfNode;
