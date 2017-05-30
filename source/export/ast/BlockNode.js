'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeList = require('./NodeList.js').NodeList;


/**
 *
 */
class BlockNode extends NodeList
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
        return 'export.ast/BlockNode';
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
module.exports.BlockNode = BlockNode;
