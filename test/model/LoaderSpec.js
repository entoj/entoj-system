'use strict';

/**
 * Requirements
 */
const Loader = require(ES_SOURCE + '/model/Loader.js').Loader;
const loaderSpec = require('./LoaderShared.js').spec;

/**
 * Spec
 */
describe(Loader.className, function()
{
    loaderSpec(Loader, 'model/Loader');
});
