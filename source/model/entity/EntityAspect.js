'use strict';

/**
 * Requirements
 * @ignore
 */
const Entity = require('./Entity.js').Entity;
const Site = require('../site/Site.js').Site;
const EntityPropertiesInheriter = require('./inheriter/EntityPropertiesInheriter.js').EntityPropertiesInheriter;
const EntityFilesInheriter = require('./inheriter/EntityFilesInheriter.js').EntityFilesInheriter;
const EntityExamplesInheriter = require('./inheriter/EntityExamplesInheriter.js').EntityExamplesInheriter;
const EntityMacrosInheriter = require('./inheriter/EntityMacrosInheriter.js').EntityMacrosInheriter;
const EntityTestSuitesInheriter = require('./inheriter/EntityTestSuitesInheriter.js').EntityTestSuitesInheriter;
const EntityTextInheriter = require('./inheriter/EntityTextInheriter.js').EntityTextInheriter;
const assertParameter = require('../../utils/assert.js').assertParameter;


/**
 * @namespace model.entity
 */
class EntityAspect extends Entity
{
    /**
     * @param {model.entity.Entity} entity
     * @param {model.site.Site} site
     */
    constructor(entity, site, inheriters)
    {
        super();

        //Check params
        assertParameter(this, 'entity', entity, true, Entity);
        assertParameter(this, 'site', site, true, Site);

        // Add initial values
        this._entity = entity;

        // Extend id
        this._id = this.entity.id.clone();
        this._id.site = site;

        // Get extended sites
        const sites = [];
        let currentSite = this.site;
        while(currentSite)
        {
            sites.unshift(currentSite);
            currentSite = currentSite.extends;
        }

        // Defaults
        // @todo find a smarter solution
        new EntityPropertiesInheriter().inherit(sites, entity, this);
        new EntityFilesInheriter().inherit(sites, entity, this);
        new EntityTextInheriter().inherit(sites, entity, this);
        new EntityExamplesInheriter().inherit(sites, entity, this);
        new EntityMacrosInheriter().inherit(sites, entity, this);
        new EntityTestSuitesInheriter().inherit(sites, entity, this);

        // Inheriters
        const inheriterList = inheriters || [];
        for (const inheriter of inheriterList)
        {
            inheriter.inherit(sites, entity, this);
        }
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [Entity, Site, 'model.entity/EntityAspect.inheriters'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.entity/EntityAspect';
    }


    /**
     * @property {model.entity.Entity}
     */
    get entity()
    {
        return this._entity;
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
module.exports.EntityAspect = EntityAspect;
