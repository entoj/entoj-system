'use strict';

/**
 * Requirements
 * @ignore
 */
const EntityInheriter = require('../EntityInheriter.js').EntityInheriter;


/**
 * Inherits files
 *
 * @namespace model.entity.inheriter
 */
class EntityFilesInheriter extends EntityInheriter
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.entity.inheriter/EntityFilesInheriter';
    }


    /**
     * @inheritDocs
     */
    inherit(sites, entity, entityAspect)
    {
        entityAspect.files.load(entity.files.filter(file => sites.indexOf(file.site) > -1));
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EntityFilesInheriter = EntityFilesInheriter;
