'use strict';

/**
 * Requirements
 * @ignore
 */
const Node = require('./Node.js').Node;


/**
 * Represents a variable node (e.g. model.text)
 */
class VariableNode extends Node
{
    /**
     * @ignore
     */
    constructor(values)
    {
        super(values);

        //fields
        this.dataFields.push('fields');
        if (values && values.fields)
        {
            this.fields = values.fields;
        }
        else
        {
            this.fields = [];
        }
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.ast/VariableNode';
    }


    /**
     * @property {Array}
     */
    get fields()
    {
        return this._fields;
    }

    set fields(value)
    {
        this._fields = Array.isArray(value) ? value : [value];
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.VariableNode = VariableNode;
