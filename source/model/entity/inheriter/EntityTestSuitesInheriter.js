'use strict';

/**
 * Requirements
 * @ignore
 */
const EntityInheriter = require('../EntityInheriter.js').EntityInheriter;


/**
 * Inherits test suites
 *
 * @namespace model.entity.inheriter
 */
class EntityTestSuitesInheriter extends EntityInheriter
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.entity.inheriter/EntityTestSuitesInheriter';
    }


    /**
     * @inheritDoc
     */
    inherit(sites, entity, entityAspect)
    {
        entityAspect.testSuites.load(entity.testSuites.filter(testSuite => sites.indexOf(testSuite.site) > -1));
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EntityTestSuitesInheriter = EntityTestSuitesInheriter;
