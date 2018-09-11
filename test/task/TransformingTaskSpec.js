'use strict';

/**
 * Requirements
 */
const TransformingTask = require(ES_SOURCE + '/task/TransformingTask.js').TransformingTask;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const transformingTaskSpec = require(ES_TEST + '/task/TransformingTaskShared.js').spec;

/**
 * Spec
 */
describe(TransformingTask.className, function() {
    transformingTaskSpec(TransformingTask, 'task/TransformingTask', function(parameters) {
        parameters.unshift(new CliLogger('', { muted: true }));
        return parameters;
    });
});
