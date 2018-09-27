'use strict';

/**
 * Requirements
 * @ignore
 */
const PluggableLoader = require('../loader/PluggableLoader.js').PluggableLoader;
const EntityCategory = require('./EntityCategory.js').EntityCategory;
const assertParameter = require('../../utils/assert.js').assertParameter;
const SystemModuleConfiguration = require('../../configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;

/**
 * @class
 *
 * Creates EntityCategory from a simple json configuration.
 *
 * @memberOf mode.site
 * @extends {PluggableLoader}
 */
class EntityCategoriesLoader extends PluggableLoader {
    /**
     * @ignore
     */
    constructor(moduleConfiguration, plugins) {
        super(plugins);

        // Check
        assertParameter(
            this,
            'moduleConfiguration',
            moduleConfiguration,
            true,
            SystemModuleConfiguration
        );

        // Add parameters
        this._moduleConfiguration = moduleConfiguration;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [SystemModuleConfiguration, 'model.entity/EntityCategoriesLoader.plugins']
        };
    }

    /**
     * @inheritDocs
     */
    static get className() {
        return 'model.entity/EntityCategoriesLoader';
    }

    /**
     * @type {configuration.SystemModuleConfiguration}
     */
    get moduleConfiguration() {
        return this._moduleConfiguration;
    }

    /**
     * @returns {Promise.<Array>}
     */
    loadItems() {
        const result = [];
        for (const config of this.moduleConfiguration.entityCategories) {
            const item = new EntityCategory(config);
            item.priority = result.length;
            result.push(item);
        }
        return Promise.resolve(result);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.EntityCategoriesLoader = EntityCategoriesLoader;
