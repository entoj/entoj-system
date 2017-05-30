'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueNode = require('./ValueNode.js').ValueNode;


/**
 * A single parameter of a ParametersNode
 */
class ParameterNode extends ValueNode
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
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.ast/ParameterNode';
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
}


/**
 * Exports
 * @ignore
 */
module.exports.ParameterNode = ParameterNode;
