'use strict';

/**
 * Requirements
 * @ignore
 */
const EntityInheriter = require('../EntityInheriter.js').EntityInheriter;
const ContentKind = require('../../ContentKind.js').ContentKind;


/**
 * Inherits examples
 *
 * @namespace model.entity.inheriter
 */
class EntityExamplesInheriter extends EntityInheriter
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.entity.inheriter/EntityExamplesInheriter';
    }


    /**
     * @inheritDocs
     */
    inherit(sites, entity, entityAspect)
    {
        const items = {};
        for (const site of sites)
        {
            entity.documentation.filter(doc => doc.contentKind === ContentKind.EXAMPLE && doc.site === site)
                .forEach(example => items[example.file.basename] = example);
        }
        entityAspect.documentation.load(items);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EntityExamplesInheriter = EntityExamplesInheriter;
