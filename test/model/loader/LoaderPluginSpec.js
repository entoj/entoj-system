'use strict';

/**
 * Requirements
 */
const LoaderPlugin = require(ES_SOURCE + '/model/loader/LoaderPlugin.js').LoaderPlugin;
const loaderPluginSpec = require('./LoaderPluginShared.js').spec;

/**
 * Spec
 */
describe(LoaderPlugin.className, function() {
    /**
     * LoaderPlugin Test
     */
    loaderPluginSpec(LoaderPlugin, 'model.loader/LoaderPlugin');
});
