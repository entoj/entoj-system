'use strict';

/**
 * Requirements
 * @ignore
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');


/**
 * Shared Exporter spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);


    /**
     * Parser Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic({ skipEntities: true });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
