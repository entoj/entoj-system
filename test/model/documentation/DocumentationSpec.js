'use strict';

/**
 * Requirements
 */
const Documentation = require(ES_SOURCE + '/model/documentation/Documentation.js').Documentation;
const documentationShared = require('./DocumentationShared.js').spec;

/**
 * Spec
 */
describe(Documentation.className, function() {
    documentationShared(Documentation, 'model.documentation/Documentation');
});
