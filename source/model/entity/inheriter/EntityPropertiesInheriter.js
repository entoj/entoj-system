'use strict';

/**
 * Requirements
 * @ignore
 */
const EntityInheriter = require('../EntityInheriter.js').EntityInheriter;
const BaseMap = require('../../../base/BaseMap.js').BaseMap;

/**
 * Inherits properties
 *
 * @namespace model.entity.inheriter
 */
class EntityPropertiesInheriter extends EntityInheriter {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'model.entity.inheriter/EntityPropertiesInheriter';
    }

    /**
     * @inheritDoc
     */
    inheritProperties(sites, entity) {
        const properties = new BaseMap();
        for (const site of sites) {
            const siteProperties = entity.properties.getByPath(site.name.toLowerCase(), {});
            properties.merge(siteProperties);
        }
        return properties;
    }

    /**
     * @inheritDoc
     */
    inherit(sites, entity, entityAspect) {
        entityAspect.properties.load(this.inheritProperties(sites, entity));
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.EntityPropertiesInheriter = EntityPropertiesInheriter;
