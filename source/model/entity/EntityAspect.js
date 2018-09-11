'use strict';

/**
 * Requirements
 * @ignore
 */
const Entity = require('./Entity.js').Entity;
const Site = require('../site/Site.js').Site;
const EntityPropertiesInheriter = require('./inheriter/EntityPropertiesInheriter.js')
    .EntityPropertiesInheriter;
const EntityFilesInheriter = require('./inheriter/EntityFilesInheriter.js').EntityFilesInheriter;
const EntityExamplesInheriter = require('./inheriter/EntityExamplesInheriter.js')
    .EntityExamplesInheriter;
const EntityMacrosInheriter = require('./inheriter/EntityMacrosInheriter.js').EntityMacrosInheriter;
const EntityTestSuitesInheriter = require('./inheriter/EntityTestSuitesInheriter.js')
    .EntityTestSuitesInheriter;
const EntityLintResultsInheriter = require('./inheriter/EntityLintResultsInheriter.js')
    .EntityLintResultsInheriter;
const EntityTextInheriter = require('./inheriter/EntityTextInheriter.js').EntityTextInheriter;
const assertParameter = require('../../utils/assert.js').assertParameter;
const metrics = require('../../utils/performance.js').metrics;

/**
 * Default Inherites
 */
const defaultInheriterList = [
    new EntityPropertiesInheriter(),
    new EntityFilesInheriter(),
    new EntityTextInheriter(),
    new EntityExamplesInheriter(),
    new EntityMacrosInheriter(),
    new EntityTestSuitesInheriter(),
    new EntityLintResultsInheriter()
];

/**
 * @namespace model.entity
 */
class EntityAspect extends Entity {
    /**
     * @param {model.entity.Entity} entity
     * @param {model.site.Site} site
     */
    constructor(entity, site, inheriters) {
        super();
        metrics.start(this.className + '::constructor');

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
        while (currentSite) {
            sites.unshift(currentSite);
            currentSite = currentSite.extends;
        }

        metrics.start(this.className + '::constructor - inheriters');

        // Defaults Inheriters
        for (const inheriter of defaultInheriterList) {
            metrics.start(this.className + '::constructor - ' + inheriter.className);
            inheriter.inherit(sites, entity, this);
            metrics.stop(this.className + '::constructor - ' + inheriter.className);
        }

        // Inheriters
        const inheriterList = inheriters || [];
        for (const inheriter of inheriterList) {
            metrics.start(this.className + '::constructor - ' + inheriter.className);
            inheriter.inherit(sites, entity, this);
            metrics.stop(this.className + '::constructor - ' + inheriter.className);
        }
        metrics.stop(this.className + '::constructor - inheriters');

        metrics.stop(this.className + '::constructor');
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: [Entity, Site, 'model.entity/EntityAspect.inheriters'] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'model.entity/EntityAspect';
    }

    /**
     * @property {model.entity.Entity}
     */
    get entity() {
        return this._entity;
    }

    /**
     * @inheritDoc
     */
    toString() {
        return `[${this.className} ${this.pathString}]`;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.EntityAspect = EntityAspect;
