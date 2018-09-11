'use strict';

/**
 * Requirements
 */
const Task = require(ES_SOURCE + '/task/Task.js').Task;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const taskSpec = require(ES_TEST + '/task/TaskShared.js').spec;

/**
 * Spec
 */
describe(Task.className, function() {
    taskSpec(Task, 'task/Task', function(parameters) {
        parameters.unshift(new CliLogger('', { muted: true }));
        return parameters;
    });
});
