'use strict';

/**
 * Configure parameters
 */
const parameters = require('minimist')(process.argv.splice(2));

/**
 * Configure path
 */
const path = require('path');
global.TESTS_RUNNING = true;
global.ES_SOURCE = path.resolve(__dirname + '/../source');
global.ES_FIXTURES = path.resolve(__dirname + '/__fixtures__');
global.ES_TEST = __dirname;
global.PATH_SEPERATOR = require('path').sep;

/**
 * Configure chai
 */
const chai = require('chai');
chai.config.includeStack = true;
global.expect = chai.expect;

const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

const chaiString = require('chai-string');
chai.use(chaiString);

const chaiThings = require('chai-things');
chai.use(chaiThings);


/**
 * Configure intel
 */
require(ES_SOURCE + '/Base.js'); // Load Base to be able to override the defaults set there
const intel = require('intel');
const logger = intel.getLogger('entoj');
let level = intel.ERROR;
if (parameters.v)
{
    level = intel.WARN;
}
if (parameters.vv)
{
    level = intel.INFO;
}
if (parameters.vvv)
{
    level = intel.DEBUG;
}
if (parameters.vvvv)
{
    level = intel.TRACE;
}
logger.setLevel(level);


/**
 * Show unhandled
 */
/* eslint no-console: 0 */
process.on('unhandledRejection', r => console.log(r));


/**
 * Configure fixtures
 */
global.fixtures = {};
