'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeList = require('./NodeList.js').NodeList;
const BaseArray = require('../../base/BaseArray.js').BaseArray;


/**
 * A node that can take optional arguments
 */
class CallableNode extends NodeList
{
    /**
     * @ignore
     */
    constructor(values)
    {
        super(values);

        //name
        this.dataFields.push('name');
        if (values && values.name)
        {
            this.name = values.name;
        }

        // arguments
        this.dataFields.push('arguments');
        this.iterableFields.push('arguments');
        this.arguments = new BaseArray();
        if (values && values.arguments)
        {
            this.arguments.load(values.arguments);
        }
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.ast/CallableNode';
    }


    /**
     * @property {String}
     */
    get name()
    {
        return this._name;
    }

    set name(value)
    {
        this._name = value;
    }


    /**
     * @property {ParametersNode}
     */
    get arguments()
    {
        return this._arguments;
    }

    set arguments(value)
    {
        if (!this.argumentsChangeHandler)
        {
            this.argumentsChangeHandler = this.handleArgumentsChange.bind(this);
        }
        if (this._arguments)
        {
            this._arguments.events.removeListener('change', this.argumentsChangeHandler);
        }
        this._arguments = value;
        if (this._arguments)
        {
            this._arguments.events.on('change', this.argumentsChangeHandler);
        }
    }


    /**
     * Updates parent property of all nodes
     */
    handleArgumentsChange()
    {
        for (const node of this.arguments)
        {
            node.parent = this;
        }
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.CallableNode = CallableNode;
