'use strict';

/**
 * Requirements
 */
const Dependency = require(ES_SOURCE + '/model/documentation/Dependency.js').Dependency;
const DependencyType = require(ES_SOURCE + '/model/documentation/DependencyType.js').DependencyType;
const valueObjectSpec = require(ES_TEST + '/model/ValueObjectShared.js').spec;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Spec
 */
describe(Dependency.className, function() {
    /**
     * ValueObject Test
     */
    valueObjectSpec(Dependency, 'model.documentation/Dependency');

    /**
     * Dependency Test
     */
    const createTestee = function() {
        return new Dependency();
    };

    // Simple properties
    baseSpec.assertProperty(createTestee(), ['type'], DependencyType.MACRO, DependencyType.UNKOWN);
    baseSpec.assertProperty(createTestee(), ['name'], 'common', '');
    baseSpec.assertProperty(createTestee(), ['data'], { custom: 42 }, {});
});
