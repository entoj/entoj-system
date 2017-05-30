'use strict';

/**
 * Requirements
 * @ignore
 */
const EntityInheriter = require('../EntityInheriter.js').EntityInheriter;
const ContentKind = require('../../ContentKind.js').ContentKind;


/**
 * Inherits macros
 *
 * @namespace model.entity.inheriter
 */
class EntityMacrosInheriter extends EntityInheriter
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.entity.inheriter/EntityMacrosInheriter';
    }


    /**
     * @inheritDocs
     */
    inherit(sites, entity, entityAspect)
    {
        const items = {};
        for (const site of sites)
        {
            entity.documentation.filter(doc => doc.contentKind === ContentKind.MACRO && doc.site === site)
                .forEach(macro => items[macro.name] = macro);
        }
        entityAspect.documentation.load(items);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EntityMacrosInheriter = EntityMacrosInheriter;
