'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;


/**
 * @namespace model.entity
 */
class EntityInheriter extends Base
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.entity/EntityInheriter';
    }


    /**
     * Inherit data from entity to entityAspect honoring
     * inheritance from extended sites.
     *
     * @param  {Array<Site>} sites
     * @param  {model.entity.Entity} entity
     * @param  {model.entity.EntityAspect} entityAspect
     * @return {void}
     */
    inherit(sites, entity, entityAspect)
    {
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EntityInheriter = EntityInheriter;
