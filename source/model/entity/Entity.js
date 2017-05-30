'use strict';

/**
 * Requirements
 * @ignore
 */
const DocumentableValueObject = require('../DocumentableValueObject.js').DocumentableValueObject;
const EntityId = require('./EntityId.js').EntityId;


/**
 * @namespace model.entity
 */
class Entity extends DocumentableValueObject
{
    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [EntityId] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.entity/Entity';
    }


    /**
     * @inheritDocs
     */
    initialize()
    {
        super.initialize();
        this._usedBy = [];
    }


    /**
     * @inheritDocs
     */
    get fields()
    {
        const fields = super.fields;
        fields.id = false;
        return fields;
    }


    /**
     * @property {*}
     */
    get uniqueId()
    {
        return this.id.pathString;
    }


    /**
     * @property {entity.EntityId}
     */
    get id()
    {
        return this._id;
    }

    set id(value)
    {
        this._id = value;
    }


    /**
     * @returns {String}
     */
    get idString()
    {
        return this.id.idString;
    }


    /**
     * @returns {String}
     */
    get pathString()
    {
        return this.id.pathString;
    }


    /**
     * @property {Array}
     */
    get usedBy()
    {
        return this._usedBy;
    }


    /**
     * @property {Bool}
     */
    get isGlobal()
    {
        return this.id ? this.id.isGlobal : false;
    }


    /**
     * @property {Site}
     */
    get site()
    {
        return this.id.site;
    }


    /**
     * @inheritDoc
     */
    toString()
    {
        return `[${this.className} ${this.id.category.longName}-${this.id.name}]`;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Entity = Entity;
