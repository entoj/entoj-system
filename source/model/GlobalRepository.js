'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const SitesRepository = require('./site/SitesRepository.js').SitesRepository;
const EntityCategoriesRepository = require('./entity/EntityCategoriesRepository.js').EntityCategoriesRepository;
const EntitiesRepository = require('./entity/EntitiesRepository.js').EntitiesRepository;
const Site = require('./site/Site.js').Site;
const DocumentationCallable = require('./documentation/DocumentationCallable.js').DocumentationCallable;
const ContentType = require('./ContentType.js').ContentType;
const assertParameter = require('../utils/assert.js').assertParameter;
const trimSlashesLeft = require('../utils/string.js').trimSlashesLeft;
const co = require('co');
const metrics = require('../utils/performance.js').__metrics;


/**
 * @class
 * @memberOf model
 * @extends {Base}
 */
class GlobalRepository extends Base
{
    /**
     * @param {EntityIdParser} entityIdParser
     */
    constructor(sitesRepository, entityCategoriesRepository, entitiesRepository)
    {
        super();

        // Check params
        assertParameter(this, 'sitesRepository', sitesRepository, true, SitesRepository);
        assertParameter(this, 'entityCategoriesRepository', entityCategoriesRepository, true, EntityCategoriesRepository);
        assertParameter(this, 'entitiesRepository', entitiesRepository, true, EntitiesRepository);

        // Assign
        this._sitesRepository = sitesRepository;
        this._entityCategoriesRepository = entityCategoriesRepository;
        this._entitiesRepository = entitiesRepository;
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [SitesRepository, EntityCategoriesRepository, EntitiesRepository] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model/GlobalRepository';
    }


    /**
     * @inheritDocs
     */
    resolve(query)
    {
        const scope = this;
        const promise = co(function*()
        {
            let site;
            let entityCategory;
            let entity;
            const parts = query && query.length ? trimSlashesLeft(query).split('/') : ['*'];

            if (parts.length == 1)
            {
                // Check *
                if (query === '*')
                {
                    site = yield scope._sitesRepository.getItems();
                    return { site: site };
                }

                // Check site
                site = yield scope._sitesRepository.findBy({ '*': query });
                if (site)
                {
                    return { site: site };
                }

                // Check category
                entityCategory = yield scope._entityCategoriesRepository.findBy({ '*': query });
                if (entityCategory)
                {
                    return { entityCategory: entityCategory };
                }
            }

            if (parts.length == 2)
            {
                // Check site / category
                site = yield scope._sitesRepository.findBy({ name: parts[0].trim() });
                if (site)
                {
                    entityCategory = yield scope._entityCategoriesRepository.findBy({ '*': parts[1].trim() });
                    if (entityCategory)
                    {
                        return { site: site, entityCategory: entityCategory };
                    }
                }
            }

            if (parts.length == 1 || parts.length == 3)
            {
                // Check entity
                entity = yield scope._entitiesRepository.getById(query);
                if (entity)
                {
                    return { entity: entity };
                }
            }

            return undefined;
        });
        return promise;
    }


    /**
     * @returns {Promise<Object>}
     */
    resolveEntity(siteQuery, entityQuery)
    {
        if (!siteQuery && !entityQuery)
        {
            return Promise.resolve(false);
        }

        const scope = this;
        const promise = co(function*()
        {
            metrics.start(scope.className + '::resolveEntity');

            // Get site
            let site = (siteQuery instanceof Site) ? siteQuery : yield scope._sitesRepository.findBy({ '*': siteQuery });
            if (!site && !siteQuery)
            {
                site = yield scope._sitesRepository.getFirst();
            }
            if (!site)
            {
                metrics.stop(scope.className + '::resolveEntity');
                /* istanbul ignore next */
                scope.logger.debug('resolveEntity - could not determine site', siteQuery);
                return false;
            }

            // Get entity
            const entities = yield scope._entitiesRepository.getBySite(site);
            let result;
            for (const entity of entities)
            {
                if (entity.id.isEqualTo(entityQuery))
                {
                    result = entity;
                }
            }

            /* istanbul ignore next */
            if (!result)
            {
                metrics.stop(scope.className + '::resolveEntity');
                scope.logger.debug('resolveEntity - could not find entity', entityQuery);
                return false;
            }

            metrics.stop(scope.className + '::resolveEntity');
            return result;
        });
        return promise;
    }


    /**
     * @inheritDoc
     */
    resolveEntities(query)
    {
        const scope = this;
        const promise = co(function*()
        {
            const result = [];
            const queryResult = yield scope.resolve(query);

            // Check if result
            if (!queryResult)
            {
                return result;
            }

            // Check site
            if (queryResult.site && !queryResult.entityCategory)
            {
                const sites = Array.isArray(queryResult.site) ? queryResult.site : [queryResult.site];
                for (const site of sites)
                {
                    const siteEntities = yield scope._entitiesRepository.getBySite(site);
                    Array.prototype.push.apply(result, siteEntities);
                }
            }

            // Check category
            if (queryResult.entityCategory && !queryResult.site)
            {
                const entityCategories = Array.isArray(queryResult.entityCategory) ? queryResult.entityCategory : [queryResult.entityCategory];
                for (const entityCategory of entityCategories)
                {
                    const entityCategoryEntities = yield scope._entitiesRepository.getByCategory(entityCategory);
                    Array.prototype.push.apply(result, entityCategoryEntities);
                }
            }

            // Check site + category
            if (queryResult.entityCategory && queryResult.site)
            {
                const siteEntityCategoryEntities = yield scope._entitiesRepository.getBySiteAndCategory(queryResult.site, queryResult.entityCategory);
                Array.prototype.push.apply(result, siteEntityCategoryEntities);
            }

            // Check entity
            if (queryResult.entity)
            {
                result.push(queryResult.entity);
            }

            return result;
        });
        return promise;
    }


    /**
     * @returns {Promise<Object>}
     */
    resolveMacro(siteQuery, macroQuery)
    {
        if (!siteQuery && !macroQuery)
        {
            return Promise.resolve(false);
        }
        const scope = this;
        const promise = co(function*()
        {
            metrics.start(scope.className + '::resolveMacro');

            // Get site
            let site = (siteQuery instanceof Site) ? siteQuery : yield scope._sitesRepository.findBy({ '*': siteQuery });
            if (!site && !siteQuery)
            {
                site = yield scope._sitesRepository.getFirst();
            }
            if (!site)
            {
                metrics.stop(scope.className + '::resolveMacro');
                /* istanbul ignore next */
                scope.logger.debug('resolveMacro - could not determine site', siteQuery);
                return false;
            }

            // Get entities
            metrics.start(scope.className + '::resolveMacro - get entities');
            const entities = yield scope._entitiesRepository.getBySite(site);
            metrics.stop(scope.className + '::resolveMacro - get entities');

            // Find macro
            for (const entity of entities)
            {
                const macro = entity.documentation.find((doc) =>
                {
                    return doc.contentType === ContentType.JINJA &&
                           doc.name === macroQuery;
                });
                if (macro)
                {
                    metrics.stop(scope.className + '::resolveMacro');
                    return macro;
                }
            }

            /* istanbul ignore next */
            scope.logger.debug('resolveMacro - could not find macro', macroQuery);
            metrics.stop(scope.className + '::resolveMacro');
            return false;
        });
        return promise;
    }


    /**
     * @param {String|model.site.Site} siteQuery
     * @param {String|model.documentation.DocumentationCallable} macroQuery
     * @returns {Promise<Object>}
     */
    resolveEntityForMacro(siteQuery, macroQuery, findDefining)
    {
        const scope = this;
        const promise = co(function*()
        {
            // Get site
            let site = (siteQuery instanceof Site) ? siteQuery : yield scope._sitesRepository.findBy({ '*': siteQuery });
            if (!site && !siteQuery)
            {
                site = yield scope._sitesRepository.getFirst();
            }
            if (!site)
            {
                /* istanbul ignore next */
                scope.logger.debug('resolveEntityForMacro - could not find site', siteQuery);
                return false;
            }

            // Get entities
            const entities = yield scope._entitiesRepository.getBySite(site);

            // Find entity
            const macroName = (macroQuery instanceof DocumentationCallable)
                ? macroQuery.name
                : macroQuery;
            for (const entity of entities)
            {
                // Find the macro
                const macro = entity.documentation.find((doc) =>
                {
                    return doc.contentType === ContentType.JINJA &&
                           doc.name === macroName;
                });

                // We want the actual entity that defined the macro
                if (macro &&
                    findDefining &&
                    macro.site.name !== site.name)
                {
                    return scope.resolveEntityForMacro(macro.site, macro.name, findDefining);
                }

                // Ok, found it
                if (macro)
                {
                    return entity;
                }
            }

            /* istanbul ignore next */
            scope.logger.debug('resolveEntityForMacro - could not find macro', macroQuery);
            return false;
        });
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.GlobalRepository = GlobalRepository;
