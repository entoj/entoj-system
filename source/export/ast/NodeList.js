'use strict';

/**
 * Requirements
 * @ignore
 */
const Node = require('./Node.js').Node;
const BaseArray = require('../../base/BaseArray.js').BaseArray;


/**
 *
 */
class NodeList extends Node
{
    /**
     * @ignore
     */
    constructor(values)
    {
        super(values);

        //children
        this.dataFields.push('children');
        this.iterableFields.push('children');
        this.children = new BaseArray();
        if (values && values.children)
        {
            this.children.load(values.children);
        }
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.ast/NodeList';
    }


    /**
     * @property {BaseArray}
     */
    get children()
    {
        return this._children;
    }

    set children(value)
    {
        if (!this.childrenChangeHandler)
        {
            this.childrenChangeHandler = this.handleChildrenChange.bind(this);
        }
        if (this._children)
        {
            this._children.events.removeListener('change', this.childrenChangeHandler);
        }
        this._children = value;
        if (this._children)
        {
            this._children.events.on('change', this.childrenChangeHandler);
        }
    }


    /**
     * Updates parent property of all nodes
     */
    handleChildrenChange()
    {
        for (const node of this.children)
        {
            node.parent = this;
        }
    }


    /**
     * @return {Bool}
     */
    replace(reference, item)
    {
        this.children.replace(reference, item);
        for (const node of this.children)
        {
            if (typeof node.replace === 'function')
            {
                node.replace(reference, item);
            }
        }
        return true;
    }


    /**
     * @return {Bool}
     */
    remove(reference)
    {
        this.children.remove(reference);
        for (const node of this.children)
        {
            if (typeof node.remove === 'function')
            {
                node.remove(reference);
            }
        }
        return true;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.NodeList = NodeList;
