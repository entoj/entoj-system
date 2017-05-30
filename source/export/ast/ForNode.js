'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeList = require('./NodeList.js').NodeList;
const ValueNodeMixin = require('./ValueNode.js').ValueNodeMixin;


/**
 *
 */
class ForNode extends ValueNodeMixin(NodeList)
{
    /**
     * @ignore
     */
    constructor(values)
    {
        super(values);

        //keyName
        this.dataFields.push('keyName');
        if (values && values.keyName)
        {
            this.keyName = values.keyName;
        }

        //name
        this.dataFields.push('valueName');
        if (values && values.valueName)
        {
            this.valueName = values.valueName;
        }
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.ast/ForNode';
    }


    /**
     * @property {String}
     */
    get keyName()
    {
        return this._keyName;
    }

    set keyName(value)
    {
        this._keyName = value;
    }


    /**
     * @property {String}
     */
    get valueName()
    {
        return this._valueName;
    }

    set valueName(value)
    {
        this._valueName = value;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ForNode = ForNode;
