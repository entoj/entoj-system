'use strict';

/**
 * Requirements
 */
const ContentType = require(ES_SOURCE + '/model/ContentType.js').ContentType;
const ContentKind = require(ES_SOURCE + '/model/ContentKind.js').ContentKind;
const Site = require(ES_SOURCE + '/model/site/Site.js').Site;
const File = require(ES_SOURCE + '/model/file/File.js').File;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const valueObjectSpec = require(ES_TEST + '/model/ValueObjectShared.js').spec;

/**
 * Shared Documentation Spec
 */
function spec(type, className, prepareParameters) {
    /**
     * ValueObject Test
     */
    valueObjectSpec(type, className, prepareParameters);

    /**
     * Documentation Test
     */
    const createTestee = function() {
        let parameters = Array.from(arguments);
        if (prepareParameters) {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    // Simple properties
    baseSpec.assertProperty(createTestee(), ['contentKind'], ContentKind.CSS);
    baseSpec.assertProperty(createTestee(), ['contentType'], ContentType.SASS);
    baseSpec.assertProperty(createTestee(), ['site'], new Site('test'), false);
    baseSpec.assertProperty(createTestee(), ['file'], new File('/test'), false);
    baseSpec.assertProperty(createTestee(), ['group'], 'common', '');
    baseSpec.assertProperty(createTestee(), ['tags'], ['core'], []);
}

/**
 * Exports
 */
module.exports.spec = spec;
