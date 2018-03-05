'use strict';

/**
 * Requirements
 * @ignore
 */
const EntityInheriter = require('../EntityInheriter.js').EntityInheriter;


/**
 * Inherits lint results
 *
 * @namespace model.entity.inheriter
 */
class EntityLintResultsInheriter extends EntityInheriter
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.entity.inheriter/EntityLintResultsInheriter';
    }


    /**
     * @inheritDoc
     */
    inherit(sites, entity, entityAspect)
    {
        entityAspect.lintResults.load(entity.lintResults.filter(lintResult => sites.indexOf(lintResult.site) > -1));
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EntityLintResultsInheriter = EntityLintResultsInheriter;
