'use strict';

/**
 * Requirements
 */
const ViewModel = require(ES_SOURCE + '/model/viewmodel/ViewModel.js').ViewModel;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Spec
 */
describe(ViewModel.className, function() {
    baseSpec(ViewModel, 'model.viewmodel/ViewModel');
    baseSpec.assertProperty(new ViewModel(), 'data', { foo: 'bar' }, false);
});
