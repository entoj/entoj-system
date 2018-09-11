'use strict';

/**
 * Requirements
 */
const ValueObject = require(ES_SOURCE + '/model/ValueObject.js').ValueObject;
const valueObjectSpec = require('./ValueObjectShared.js').spec;
const BaseArray = require(ES_SOURCE + '/base/BaseArray.js').BaseArray;
const BaseMap = require(ES_SOURCE + '/base/BaseMap.js').BaseMap;

/**
 * Spec
 */
describe(ValueObject.className, function() {
    /**
     * ValueObject Test
     */
    valueObjectSpec(ValueObject, 'model/ValueObject');

    /**
     * ValueObject Local Test
     */
    class TestValueObject extends ValueObject {
        constructor(fields) {
            super();
            this._fields = fields || {};
        }

        get fields() {
            return this._fields;
        }

        set fields(value) {
            this._fields = value;
        }
    }

    class TestNestedValueObject extends TestValueObject {
        constructor() {
            super({ street: '', nr: '' });
        }
    }

    describe('#uniqueId', function() {
        it('should return the object instance per default', function() {
            const testee = new ValueObject();
            expect(testee.uniqueId).to.be.equal(testee);
        });
    });

    describe('#isEqualTo', function() {
        it('should return false when both objects are not the same instance', function() {
            const testee = new ValueObject();
            const other = new ValueObject();
            expect(testee.isEqualTo(other)).to.be.not.ok;
        });
    });

    describe('#hydrate', function() {
        it('should hydrate nested value objects', function() {
            const fields = {
                name: '',
                age: 0,
                address: TestNestedValueObject
            };
            const expected = {
                name: '',
                age: 0,
                address: {
                    street: '',
                    nr: ''
                }
            };
            const testee = new TestValueObject(fields);
            testee.dehydrate({});
            const hydrated = testee.hydrate();
            expect(hydrated).to.be.deep.equal(expected);
        });
    });

    describe('#dehydrate', function() {
        it('should import known fields', function() {
            const fields = {
                name: '',
                age: 0,
                address: false
            };
            const values = {
                name: 'jon',
                lastName: 'king'
            };
            const testee = new TestValueObject();
            testee.fields = fields;
            testee.dehydrate(values);
            expect(testee.name).to.be.equal('jon');
            expect(testee.age).to.be.equal(0);
            expect(testee.address).to.be.equal(false);
            expect(testee.lastName).to.be.undefined;
        });

        it('should allow to import BaseArray fields', function() {
            const fields = {
                name: '',
                properties: BaseArray
            };
            const values = {
                name: 'jon',
                properties: ['king']
            };
            const testee = new TestValueObject();
            testee.fields = fields;
            testee.dehydrate(values);
            expect(testee.name).to.be.equal('jon');
            expect(testee.properties).to.be.instanceof(BaseArray);
            expect(testee.properties).to.have.length(1);
            expect(testee.properties[0]).to.be.equal('king');
        });

        it('should clear BaseArray fields before importing', function() {
            const fields = {
                name: '',
                properties: BaseArray
            };
            const values1 = {
                name: 'jon',
                properties: ['king']
            };
            const values2 = {
                properties: ['karl']
            };
            const testee = new TestValueObject();
            testee.fields = fields;
            testee.dehydrate(values1);
            testee.dehydrate(values2);
            expect(testee.name).to.be.equal('jon');
            expect(testee.properties).to.be.instanceof(BaseArray);
            expect(testee.properties).to.have.length(1);
            expect(testee.properties[0]).to.be.equal('karl');
        });

        it('should allow to import BaseMap fields', function() {
            const fields = {
                name: '',
                properties: BaseMap
            };
            const values = {
                name: 'jon',
                properties: { status: 'king' }
            };
            const testee = new TestValueObject();
            testee.fields = fields;
            testee.dehydrate(values);
            expect(testee.name).to.be.equal('jon');
            expect(testee.properties).to.be.instanceof(BaseMap);
            expect(testee.properties.size).to.be.equal(1);
            expect(testee.properties.get('status')).to.be.equal('king');
        });
    });
});
