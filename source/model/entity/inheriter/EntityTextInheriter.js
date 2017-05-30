'use strict';

/**
 * Requirements
 * @ignore
 */
const EntityInheriter = require('../EntityInheriter.js').EntityInheriter;
const ContentKind = require('../../ContentKind.js').ContentKind;


/**
 * Inherits text
 *
 * @namespace model.entity.inheriter
 */
class EntityTextInheriter extends EntityInheriter
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.entity.inheriter/EntityTextInheriter';
    }


    /**
     * @inheritDocs
     */
    inherit(sites, entity, entityAspect)
    {
        let items = [];
        for (const site of sites)
        {
            items = entity.documentation.filter(doc => doc.contentKind === ContentKind.TEXT && doc.site === site);
        }
        entityAspect.documentation.load(items);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EntityTextInheriter = EntityTextInheriter;
