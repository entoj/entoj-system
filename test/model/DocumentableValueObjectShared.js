'use strict';

/**
 * Requirements
 * @ignore
 */
const baseSpec = require('../BaseShared.js').spec;
const valueObjectSpec = require('./ValueObjectShared.js').spec;
const DocumentationArray = require(ES_SOURCE + '/model/documentation/DocumentationArray.js').DocumentationArray;
const BaseArray = require(ES_SOURCE + '/base/BaseArray.js').BaseArray;
const BaseMap = require(ES_SOURCE + '/base/BaseMap.js').BaseMap;
const TestArray = require(ES_SOURCE + '/model/test/TestArray.js').TestArray;


/**
 * Shared DocumentableValueObject spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * ValueObject Test
     */
    valueObjectSpec(type, className, prepareParameters);


    /**
     * DocumentableValueObject Test
     */
    const createTestee = function()
    {
        let parameters = Array.from(arguments);
        if (prepareParameters)
        {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    // Simple properties
    baseSpec.assertProperty(createTestee(), ['properties'], undefined, BaseMap);
    baseSpec.assertProperty(createTestee(), ['documentation'], undefined, DocumentationArray);
    baseSpec.assertProperty(createTestee(), ['files'], undefined, BaseArray);
    baseSpec.assertProperty(createTestee(), ['tests'], undefined, TestArray);

    describe('#dehydrate', function()
    {
        it('should allow to update properties, documentation and files with a object', function()
        {
            const data =
            {
                properties:
                {
                    foo: 'bar'
                },
                documentation:
                [
                    'foo'
                ],
                files:
                [
                    'bar'
                ],
                tests:
                [
                    'boom'
                ]
            };
            const testee = createTestee();

            testee.dehydrate(data);
            expect(testee.properties.getByPath('foo')).to.be.equal('bar');
            expect(testee.documentation).to.include('foo');
            expect(testee.files).to.include('bar');
            expect(testee.tests).to.include('boom');
        });

        it('should allow to update properties, documentation and files with another ValueObject', function()
        {
            const data = createTestee();
            data.properties.set('foo', 'bar');
            data.documentation.push('foo');
            data.files.push('bar');
            data.tests.push('boom');
            const testee = createTestee();

            testee.dehydrate(data);
            expect(testee.properties.getByPath('foo')).to.be.equal('bar');
            expect(testee.documentation).to.include('foo');
            expect(testee.files).to.include('bar');
            expect(testee.tests).to.include('boom');
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
