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
class EntityPropertiesInheriter extends EntityInheriter
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.entity.inheriter/EntityPropertiesInheriter';
    }


    /**
     * @inheritDocs
     */
    inherit(sites, entity, entityAspect)
    {
        const properties = new BaseMap();
        for (const site of sites)
        {
            const siteProperties = entity.properties.getByPath(site.name.toLowerCase(), {});
            properties.merge(siteProperties);
        }
        entityAspect.properties.load(properties);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EntityPropertiesInheriter = EntityPropertiesInheriter;
