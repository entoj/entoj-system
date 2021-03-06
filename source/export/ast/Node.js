'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;
const BaseArray = require('../../base/BaseArray.js').BaseArray;


/**
 * @class
 * @memberOf export.ast
 * @extends {Base}
 */
class Node extends Base
{
    /**
     * @param {Object} values
     */
    constructor(values)
    {
        super();

        // Assign options
        const v = values || {};
        this._parent = v.parent || false;
        this._type = v.type || this.className.split('/').pop();
        this._dataFields = [];
        this._iterableFields = [];
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.ast/Node';
    }


    /**
     * @property {Array}
     */
    get iterableFields()
    {
        return this._iterableFields;
    }

    set iterableFields(value)
    {
        this._iterableFields = value;
    }


    /**
     * @property {Array}
     */
    get dataFields()
    {
        return this._dataFields;
    }

    set dataFields(value)
    {
        this._dataFields = value;
    }


    /**
     * @property {String}
     */
    get type()
    {
        return this._type;
    }

    set type(value)
    {
        this._type = value;
    }


    /**
     * @property {export.ast.Node}
     */
    get parent()
    {
        return this._parent;
    }

    set parent(value)
    {
        this._parent = value;
    }


    /**
     * @property {export.ast.Node}
     */
    get next()
    {
        if (!this.parent || !this.parent.children)
        {
            return false;
        }
        const index = this.parent.children.indexOf(this);
        return this.parent.children[index + 1] || false;
    }


    /**
     * @property {export.ast.Node}
     */
    get previous()
    {
        if (!this.parent || !this.parent.children)
        {
            return false;
        }
        const index = this.parent.children.indexOf(this);
        return this.parent.children[index - 1] || false;
    }


    /**
     * Checks if node is of a specific type or has a specific property
     *
     * @param {String|Array} [type] - Node type
     * @param {Object} [properties] - Node properties
     * @return {Bool}
     */
    is(type, properties)
    {
        // Check type
        if (type)
        {
            const types = Array.isArray(type) ? type : [type];
            if (types.indexOf(this.type) === -1)
            {
                return false;
            }
        }

        // Check properties
        if (properties)
        {
            for (const property in properties)
            {
                const query = properties[property];

                // Query for value
                if (typeof query === 'string' || Array.isArray(query))
                {
                    const values = Array.isArray(query) ? query : [query];
                    if (values.indexOf(this[property]) === -1)
                    {
                        return false;
                    }
                }
            }
        }
        return true;
    }


    /**
     * Checks if any of this nodes parents is of a specific type or has a specific property
     *
     * @param {String|Array} [type] - Node type
     * @param {Object} [properties] - Node properties
     * @return {Bool}
     */
    isChildOf(type, properties)
    {
        if (!this.parent)
        {
            return false;
        }
        if (this.parent.is(type, properties))
        {
            return true;
        }
        return this.parent.isChildOf(type, properties);
    }


    /**
     * Returns the node at offset.
     * Optionaly checks type & properties
     *
     * @param {Number} offset
     * @return {export.ast.Node}
     */
    peek(offset, type, properties)
    {
        if (!offset)
        {
            return this;
        }
        if (!this.parent || !this.parent.children)
        {
            return false;
        }
        const index = this.parent.children.indexOf(this);
        const result = this.parent.children[index + offset] || false;
        if (result && !result.is(type, properties))
        {
            return false;
        }
        return result;
    }


    /**
     * Finds the first nodes with a specific type or property
     *
     * @param {String|Array} [type] - Node type
     * @param {Object} [properties] - Node properties
     * @return {export.ast.Node}
     */
    find(type, properties)
    {
        if (this.is(type, properties))
        {
            return this;
        }
        for (const iterableField of this.iterableFields)
        {
            if (this[iterableField] instanceof Node)
            {
                const found = this[iterableField].find(type, properties);
                if (found)
                {
                    return found;
                }
            }
            if (this[iterableField] instanceof BaseArray)
            {
                for (const node of this[iterableField])
                {
                    if (node instanceof Node)
                    {
                        const found = node.find(type, properties);
                        if (found)
                        {
                            return found;
                        }
                    }
                }
            }
        }
        return false;
    }


    /**
     * Finds the first nodes with a specific type or property
     *
     * @param {String|Array} [type] - Node type
     * @param {Object} [properties] - Node properties
     * @return {export.ast.Node}
     */
    findParent(type, properties)
    {
        if (this.is(type, properties))
        {
            return this;
        }
        if (!this.parent)
        {
            return false;
        }
        return this.parent.findParent(type, properties);
    }


    /**
     * Filters nodes with a specific type or property
     *
     * @param {String|Array} [type] - Node type
     * @param {Object} [properties] - Node properties
     * @return {Array}
     */
    filter(type, properties)
    {
        const result = [];
        if (this.is(type, properties))
        {
            result.push(this);
        }
        for (const iterableField of this.iterableFields)
        {
            if (this[iterableField] instanceof Node)
            {
                result.push(...this[iterableField].filter(type, properties));
            }
            if (this[iterableField] instanceof BaseArray)
            {
                for (const node of this[iterableField])
                {
                    result.push(...node.filter(type, properties));
                }
            }
        }
        return result;
    }


    /**
     * Recursively serializes all dataFields into a object.
     *
     * @return {Object}
     */
    serialize()
    {
        const result = { type: this.type };
        for (const field of this.dataFields)
        {
            if (Array.isArray(this[field]))
            {
                result[field] = [];
                for (const item of this[field])
                {
                    if (item instanceof Node)
                    {
                        result[field].push(item.serialize());
                    }
                    else
                    {
                        result[field].push(item);
                    }
                }
            }
            else if (this[field] instanceof Node)
            {
                result[field] = this[field].serialize();
            }
            else
            {
                result[field] = this[field];
            }
        }
        return result;
    }


    /**
     * Clone the current node.
     *
     * @return {export.ast/Node}
     */
    clone()
    {
        const result = new this.constructor();
        for (const field of this.dataFields)
        {
            if (Array.isArray(this[field]))
            {
                result[field] = new BaseArray();
                for (const item of this[field])
                {
                    if (item instanceof Node)
                    {
                        result[field].push(item.clone());
                    }
                    else
                    {
                        result[field].push(item);
                    }
                }
            }
            else if (this[field] instanceof Node)
            {
                result[field] = this[field].clone();
            }
            else
            {
                result[field] = this[field];
            }
        }
        result.dataFields = this.dataFields.slice(0);
        result.iterableFields = this.iterableFields.slice(0);
        return result;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Node = Node;
