'use strict';

/**
 * Requirements
 */
const Configuration = require(ES_SOURCE + '/export/Configuration.js').Configuration;
const configurationSpec = require('./ConfigurationShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');


/**
 * Spec
 */
describe(Configuration.className, function()
{
    /**
     * Configuration Test
     */
    function prepareParameters(parameters)
    {
        if (parameters && parameters.length >= 8)
        {
            return parameters;
        }
        const fixture = projectFixture.createStatic({ skipEntities: true });
        return [undefined, undefined, {}, undefined, undefined, undefined, fixture.globalRepository, fixture.buildConfiguration];
    }

    configurationSpec(Configuration, 'export/Configuration', prepareParameters);
});
