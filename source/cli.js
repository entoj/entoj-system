'use strict';

const Bootstrap = require('./application/Bootstrap.js').Bootstrap;
const Runner = require('./application/Runner.js').Runner;

// Bootstrap
let configuration = false;
if (process.argv.length > 1 && process.argv[process.argv.length - 2] == '--configuration') {
    configuration = require(process.argv[process.argv.length - 1]);
}
const bootstrap = new Bootstrap(configuration, {
    system: { cli: { arguments: require('minimist')(process.argv.splice(2)) } }
});

// Run
const runner = bootstrap.di.create(Runner);
runner.run();
