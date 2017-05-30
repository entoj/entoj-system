'use strict';

/**
 * Requirements
 */
const ViewModelPlugin = require(ES_SOURCE + '/model/viewmodel/ViewModelPlugin.js').ViewModelPlugin;
const viewModelSpec = require('./ViewModelPluginShared.js').spec;

/**
 * Spec
 */
describe(ViewModelPlugin.className, function()
{
    viewModelSpec(ViewModelPlugin, 'model.viewmodel/ViewModelPlugin');
});
