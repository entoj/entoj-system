'use strict';

/**
 * Requirements
 * @ignore
 */
const Repository = require('../Repository.js').Repository;
const EntitiesLoader = require('./EntitiesLoader.js').EntitiesLoader;
const IdParser = require('../../parser/entity/IdParser.js').IdParser;
const EntityCategory = require('./EntityCategory.js').EntityCategory;
const Entity = require('./Entity.js').Entity;
const EntityAspect = require('./EntityAspect.js').EntityAspect;
const Site = require('../site/Site.js').Site;
const assertParameter = require('../../utils/assert.js').assertParameter;
const co = require('co');


/**
 * EntityAspect cache
 */
let entityAspectCacheEnabled = false;
const entityAspectCache = {};


/**
 * Creates a EntityAspect and caches it if enabled
 *
 * @param {model.entity.Entity} entity
 * @param {model.site.Site} site
 * @return {model.entity.EntityAspect}
 */
function createEntityAspect(entity, site)
{
    if (!entityAspectCacheEnabled)
    {
        return new EntityAspect(entity, site);
    }
    const key = site.name + '::' + entity.idString;
    if (!entityAspectCacheEnabled || !entityAspectCache[key])
    {
        entityAspectCache[key] = new EntityAspect(entity, site);
    }
    return entityAspectCache[key];
}


/**
 * Enables the EntityAspect cache
 */
function enableEntityAspectCache()
{
    entityAspectCacheEnabled = true;
}


/**
 * Disables the EntityAspect cache
 */
function disableEntityAspectCache()
{
    entityAspectCacheEnabled = false;
}


/**
 * @class
 * @memberOf model.entity
 * @extends {Base}
 */
class EntitiesRepository extends Repository
{
    /**
     * @param {EntityIdParser} entityIdParser
     */
    constructor(entityIdParser, loader)
    {
        super(loader);

        // Check params
        assertParameter(this, 'entityIdParser', entityIdParser, true, IdParser);

        // Assign
        this._entityIdParser = entityIdParser;
        this._entityIdTemplate = this._entityIdParser.idTemplate;
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [IdParser, EntitiesLoader] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model.entity/EntitiesRepository';
    }


    /**
     * @property {EntityIdParser}
     */
    get entityIdParser()
    {
        return this._entityIdParser;
    }


    /**
     * @protected
     * @returns {Promise.<Array>}
     */
    invalidateFind(query)
    {
        const scope = this;
        const promise = co(function *()
        {
            let result = [];
            if (typeof query == 'string')
            {
                const entity = yield scope.getById(query);
                if (entity)
                {
                    result.push(entity);
                }
            }
            else if (query instanceof Entity)
            {
                const entity = yield scope.getById(query.id);
                if (entity)
                {
                    result.push(entity instanceof EntityAspect ? entity.entity : entity);
                }
            }
            else
            {
                result = yield Repository.prototype.invalidateFind.apply(scope, [query]);
            }
            return result;
        });
        return promise;
    }


    /**
     * @param {Entity}
     * @param {Site}
     * @returns {Promise.<Array>}
     */
    filterEntities(site, entityCategory, item)
    {
        if (!item)
        {
            return false;
        }
        if (site && (item.id.site !== site) && (item.usedBy.indexOf(site) == -1))
        {
            return false;
        }
        if (site && (item.id.site !== site) && Array.isArray(site.extendExcludes))
        {
            for (const exclude of site.extendExcludes)
            {
                if (item.id.category.longName.toLowerCase() === exclude.toLowerCase())
                {
                    return false;
                }
                if (item.id.category.pluralName.toLowerCase() === exclude.toLowerCase())
                {
                    return false;
                }
            }
        }
        if (entityCategory && (item.id.category !== entityCategory))
        {
            return false;
        }
        return true;
    }


    /**
     * @param {Site}
     * @returns {Promise.<Array>}
     */
    getBySite(site)
    {
        // Check params
        assertParameter(this, 'site', site, true, Site);

        // Find
        const scope = this;
        const promise = co(function *()
        {
            const entities = yield scope.getItems();
            const result = entities
                .filter(scope.filterEntities.bind(scope, site, false))
                .map(item => createEntityAspect(item, site));
            return result;
        });
        return promise;
    }


    /**
     * @param {EntityCategory}
     * @returns {Promise.<Array>}
     */
    getByCategory(entityCategory)
    {
        // Check params
        assertParameter(this, 'entityCategory', entityCategory, true, EntityCategory);

        // Find
        const scope = this;
        const promise = this.getItems().then(function(data)
        {
            return data.filter(scope.filterEntities.bind(scope, false, entityCategory));
        });
        return promise;
    }


    /**
     * @param {Site}
     * @param {EntityCategory}
     * @returns {Promise.<Array>}
     */
    getBySiteAndCategory(site, entityCategory)
    {
        // Check params
        assertParameter(this, 'site', site, true, Site);
        assertParameter(this, 'entityCategory', entityCategory, true, EntityCategory);

        // Find
        const scope = this;
        const promise = this.getItems().then(function(data)
        {
            const result = data
                .filter(scope.filterEntities.bind(scope, site, entityCategory))
                .map(item => createEntityAspect(item, site));
            return result;
        });
        return promise;
    }


    /**
     * @param {string|EntityId}
     * @param [{Site}]
     * @returns {Promise.<Entity>}
     */
    getById(entityId, site)
    {
        const scope = this;
        const promise = co(function *()
        {
            const data = yield scope.getItems();
            let id = entityId;
            if (typeof entityId === 'string')
            {
                const parsedId = yield scope.entityIdParser.parse(entityId);
                id = parsedId.entityId;
                if (!id)
                {
                    return false;
                }
            }
            else
            {
                id = entityId.clone();
            }
            if (site)
            {
                id.site = site;
            }
            const entity = data.find(item => item.id.isEqualTo(id, true));
            if (entity && id && id.site)
            {
                return createEntityAspect(entity, id.site);
            }

            return entity;
        });
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.EntitiesRepository = EntitiesRepository;
module.exports.enableEntityAspectCache = enableEntityAspectCache;
module.exports.disableEntityAspectCache = disableEntityAspectCache;
