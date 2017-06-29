'use strict';

const Context = require('./application/Context.js').Context;
const Runner = require('./application/Runner.js').Runner;

// Check for local configuration
let configuration = {};
if (process.argv.length > 1 && process.argv[process.argv.length - 2] == '--configuration')
{
    const filename = process.argv[process.argv.length - 1];
    configuration = require(filename);
}

// Add cli parameters
configuration.parameters = require('minimist')(process.argv.splice(2));

// Create context & run commands
const context = new Context(configuration);
const runner = context.di.create(Runner);
runner.run();
