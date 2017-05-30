'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeList = require('./NodeList.js').NodeList;
const BaseArray = require('../../base/BaseArray.js').BaseArray;


/**
 * Represents a callable macro that may have parameters
 */
class MacroNode extends NodeList
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

        // parameters
        this.dataFields.push('parameters');
        this.iterableFields.push('parameters');
        this.parameters = new BaseArray();
        if (values && values.parameters)
        {
            this.parameters.load(values.parameters);
        }
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.ast/MacroNode';
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
    get parameters()
    {
        return this._parameters;
    }

    set parameters(value)
    {
        if (!this.parametersChangeHandler)
        {
            this.parametersChangeHandler = this.handleParametersChange.bind(this);
        }
        if (this._parameters)
        {
            this._parameters.events.removeListener('change', this.parametersChangeHandler);
        }
        this._parameters = value;
        if (this._parameters)
        {
            this._parameters.events.on('change', this.parametersChangeHandler);
        }
    }


    /**
     * Updates parent property of all nodes
     */
    handleParametersChange()
    {
        for (const node of this.parameters)
        {
            node.parent = this;
        }
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.MacroNode = MacroNode;
