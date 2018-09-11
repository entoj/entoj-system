'use strict';

/**
 * Requirements
 */
const EntitiesTask = require(ES_SOURCE + '/task/EntitiesTask.js').EntitiesTask;
const entitiesTaskSpec = require(ES_TEST + '/task/EntitiesTaskShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');

/**
 * Spec
 */
describe(EntitiesTask.className, function() {
    entitiesTaskSpec(EntitiesTask, 'task/EntitiesTask', function(parameters) {
        const fixture = projectFixture.createStatic();
        return [fixture.cliLogger, fixture.globalRepository];
    });
});
