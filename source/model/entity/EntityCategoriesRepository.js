'use strict';

/**
 * Requirements
 * @ignore
 */
const Repository = require('../Repository.js').Repository;
const EntityCategoriesLoader = require('./EntityCategoriesLoader.js').EntityCategoriesLoader;

/**
 * @class
 * @memberOf model.entity
 * @extends {Base}
 */
class EntityCategoriesRepository extends Repository {
    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: [EntityCategoriesLoader] };
    }

    /**
     * @inheritDocs
     */
    static get className() {
        return 'model.entity/EntityCategoriesRepository';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.EntityCategoriesRepository = EntityCategoriesRepository;
