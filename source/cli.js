'use strict';

const Bootstrap = require('./application/Bootstrap.js').Bootstrap;
const Context = require('./application/Context.js').Context;
const Runner = require('./application/Runner.js').Runner;

// Bootstrap
let configuration = false;
if (process.argv.length > 1 && process.argv[process.argv.length - 2] == '--configuration') {
    configuration = require(process.argv[process.argv.length - 1]);
}
const bootstrap = new Bootstrap(configuration, {
    system: { arguments: require('minimist')(process.argv.splice(2)) }
});
bootstrap.start();

// Create context & run commands
const context = new Context(bootstrap.di, bootstrap.configuration);
const runner = context.di.create(Runner);
runner.run();
