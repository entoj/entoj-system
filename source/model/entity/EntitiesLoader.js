'use strict';

/**
 * Requirements
 * @ignore
 */
const PluggableLoader = require('../loader/PluggableLoader.js').PluggableLoader;
const PathesConfiguration = require('../configuration/PathesConfiguration.js').PathesConfiguration;
const IdParser = require('../../parser/entity/IdParser.js').IdParser;
const Entity = require('./Entity.js').Entity;
const EntityCategoriesRepository = require('./EntityCategoriesRepository.js')
    .EntityCategoriesRepository;
const SitesRepository = require('../site/SitesRepository.js').SitesRepository;
const assertParameter = require('../../utils/assert.js').assertParameter;
const co = require('co');
const fs = require('co-fs-extra');

/**
 * @class
 * @memberOf mode.site
 * @extends {PluggableLoader}
 */
class EntitiesLoader extends PluggableLoader {
    /**
     * @param {model.site.SitesRepository} sitesRepository
     * @param {model.entity.EntityCategoriesRepository} entityCategoriesRepository
     * @param {parser.entity.IdParser} idParser
     * @param {model.configuration.PathesConfiguration} pathesConfiguration
     * @param {Array} plugins
     */
    constructor(
        sitesRepository,
        entityCategoriesRepository,
        entityIdParser,
        pathesConfiguration,
        plugins
    ) {
        super(plugins);

        //Check params
        assertParameter(this, 'sitesRepository', sitesRepository, true, SitesRepository);
        assertParameter(
            this,
            'entityCategoriesRepository',
            entityCategoriesRepository,
            true,
            EntityCategoriesRepository
        );
        assertParameter(this, 'entityIdParser', entityIdParser, true, IdParser);
        assertParameter(
            this,
            'pathesConfiguration',
            pathesConfiguration,
            true,
            PathesConfiguration
        );

        // Assign options
        this._pathesConfiguration = pathesConfiguration;
        this._entityCategoriesRepository = entityCategoriesRepository;
        this._sitesRepository = sitesRepository;
        this._entityIdParser = entityIdParser;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [
                SitesRepository,
                EntityCategoriesRepository,
                IdParser,
                PathesConfiguration,
                'model.entity/EntitiesLoader.plugins'
            ]
        };
    }

    /**
     * @inheritDocs
     */
    static get className() {
        return 'model.entity/EntitiesLoader';
    }

    /**
     * @type {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration() {
        return this._pathesConfiguration;
    }

    /**
     * @type {model.site.SitesRepository}
     */
    get sitesRepository() {
        return this._sitesRepository;
    }

    /**
     * @type {model.entity.EntityCategoriesRepository}
     */
    get entityCategoriesRepository() {
        return this._entityCategoriesRepository;
    }

    /**
     * @type {parser.entity.IdParser}
     */
    get entityIdParser() {
        return this._entityIdParser;
    }

    /**
     * Loads all basic entities informations
     *
     * @returns {Promise.<Array>}
     */
    readEntityDirectories() {
        const scope = this;
        const promise = co(function*() {
            // Prepare
            const result = [];
            const categories = yield scope.entityCategoriesRepository.getItems();
            const sites = yield scope.sitesRepository.getItems();

            // Read each site
            for (const site of sites) {
                const sitePath = yield scope.pathesConfiguration.resolveSite(site);
                const sitePathExists = yield fs.exists(sitePath);
                if (sitePathExists) {
                    // Read each category
                    for (const category of categories) {
                        const categoryPath = yield scope.pathesConfiguration.resolveEntityCategory(
                            site,
                            category
                        );
                        const categoryPathExists = yield fs.exists(categoryPath);
                        if (categoryPathExists) {
                            const categoryName = categoryPath.replace(
                                scope.pathesConfiguration.sites,
                                ''
                            );
                            let entityId;

                            // Global category
                            if (category.isGlobal) {
                                result.push(categoryName);
                            }
                            // Read entities
                            else {
                                const directories = yield fs.readdir(categoryPath);
                                for (const entityName of directories) {
                                    entityId = yield scope.entityIdParser.parse(
                                        categoryName + '/' + entityName
                                    );
                                    if (
                                        entityId &&
                                        (entityId.entityName.length || entityId.entityNumber)
                                    ) {
                                        result.push(categoryName + '/' + entityName);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return result;
        });

        return promise;
    }

    /**
     * @inheritDocs
     */
    loadItems(items) {
        const scope = this;
        const promise = co(function*() {
            // Prepare
            const result = [];
            const ids = {};
            let entityPathes;

            // Get pathes
            if (Array.isArray(items)) {
                entityPathes = items;
            } else {
                entityPathes = yield scope.readEntityDirectories();
            }

            // Read entityPathes
            for (const entityPath of entityPathes) {
                // Parse id
                const entityId = yield scope.entityIdParser.parse(entityPath);
                if (!entityId) {
                    scope.logger.debug('loadItems - skip entity : unknown id ' + entityPath);
                    continue;
                }

                // See if already added
                if (typeof ids[entityId.entityId.idString] !== 'undefined') {
                    scope.logger.debug(
                        'loadItems - skip entity already defined : ' +
                            entityPath +
                            ' - ' +
                            entityId.entityId.idString
                    );
                    continue;
                }

                // Check if extended only
                if (entityId.site && entityId.site.extends) {
                    entityId.entityId.site = entityId.site.extends;
                    const baseEntityPath = yield scope.pathesConfiguration.resolveEntityId(
                        entityId.entityId
                    );
                    const baseEntityExists = yield fs.exists(baseEntityPath);
                    if (!baseEntityExists) {
                        entityId.entityId.site = entityId.site;
                    } else {
                        scope.logger.debug(
                            'loadItems - we need to load load the source entity for ' +
                                entityId.idString
                        );
                    }
                }

                // Check entity
                let entity;
                if (entityId.site && (entityId.entityName.length || entityId.entityNumber)) {
                    entity = new Entity({ id: entityId.entityId });
                }
                // Global category
                else if (
                    entityId.site &&
                    entityId.entityCategory &&
                    entityId.entityCategory.isGlobal
                ) {
                    entity = new Entity({ id: entityId.entityId });
                }

                // Add
                if (entity) {
                    scope.logger.debug('loadItems - adding entity : ' + entity.pathString);
                    result.push(entity);
                    ids[entityId.entityId.idString] = entity;
                } else {
                    scope.logger.debug('loadItems - could not create entity : ' + entityPath);
                }
            }

            // Apply site extend
            const sites = yield scope.sitesRepository.getItems();
            for (const site of sites) {
                if (site.extends) {
                    for (const entity of result) {
                        if (entity.id.site === site.extends) {
                            entity.usedBy.push(site);
                        }
                    }
                }
            }

            return result;
        });
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.EntitiesLoader = EntitiesLoader;
