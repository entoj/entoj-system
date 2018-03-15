'use strict';

/**
 * Requirements
 */
const NunjucksFileLinter = require(ES_SOURCE + '/linter/NunjucksFileLinter.js').NunjucksFileLinter;
const EntityRenderer = require(ES_SOURCE + '/nunjucks/EntityRenderer.js').EntityRenderer;
const fileLinterSpec = require('./FileLinterShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');


/**
 * Spec
 */
describe(NunjucksFileLinter.className, function()
{
    /**
     * NunjucksFileLinter Fixture
     */
    const fixture =
    {
        root: require('../index.js').fixture.files,
        glob: ['/mixed/*.j2', '/j2/*.j2'],
        globCount: 2
    };

    /**
     * NunjucksFileLinter Test
     */
    fileLinterSpec(NunjucksFileLinter, 'linter/NunjucksFileLinter', fixture, (parameters) =>
    {
        const fixture = projectFixture.createDynamic();
        const entityRenderer = fixture.context.di.create(EntityRenderer);
        while (parameters.length < 2)
        {
            parameters.push(undefined);
        }
        parameters.push(entityRenderer);
        return parameters;
    });
});
