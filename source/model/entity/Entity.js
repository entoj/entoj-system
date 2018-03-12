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
     * @param {*} values
     * @returns {void}
     */
    dehydrate(values)
    {
        super.dehydrate(values);
        this._sitesChain = [];
        let currentSite = this.site;
        while (currentSite)
        {
            this._sitesChain.push(currentSite);
            currentSite = currentSite.extends;
        }
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
     * Returns the site and all sites that it extends from.
     *
     * @property {Array<Site>}
     */
    get sitesChain()
    {
        return this._sitesChain;
    }


    /**
     * Checke if the entity provides it's own content for kind or if it inherits the contents.
     *
     * @returns {Boolean}
     */
    hasOwnContentOfKind(kind)
    {
        const files = this.files.filterBy(
            {
                contentKind: kind,
                site: this.site
            });
        return files.length > 0;
    }


    /**
     * @inheritDoc
     */
    toString()
    {
        return `[${this.className} ${this.pathString}]`;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Entity = Entity;
