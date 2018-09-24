'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require(ES_SOURCE + '/Base.js').Base;

/**
 * Spec
 */
function spec(type, className, prepareParameters) {
    const createTestee = function() {
        let parameters = Array.from(arguments);
        if (prepareParameters) {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    /**
     * Helper for testing simple getter/setter
     *
     * @param  {Instance} testee
     * @param  {String} name
     * @param  {Mixed} value
     * @param  {Mixed} defaulValue
     */
    spec.assertProperty = function(testee, name, value, defaulValue) {
        const prefix = testee instanceof Base ? '.' : '#';
        const names = Array.isArray(name) ? name : [name];

        for (const propertyName of names) {
            describe(prefix + propertyName, function() {
                if (typeof value === 'undefined' && typeof defaulValue === 'undefined') {
                    it('should exist', function() {
                        expect(testee[propertyName]).to.be.not.undefined;
                    });
                }

                if (typeof defaulValue === 'function' && defaulValue.className) {
                    it('should be of type ' + defaulValue.className, function() {
                        expect(testee[propertyName]).to.be.instanceof(defaulValue);
                    });
                } else if (typeof defaulValue !== 'undefined') {
                    it('should have a default value', function() {
                        expect(testee[propertyName]).to.be.deep.equal(defaulValue);
                    });
                }

                if (typeof value !== 'undefined') {
                    it('should allow to read & write a value', function() {
                        testee[propertyName] = value;
                        expect(testee[propertyName]).to.be.deep.equal(value);
                    });
                } else {
                    it('should be readonly', function() {
                        expect(() => (testee[propertyName] = value)).to.throw();
                    });
                }
            });
        }
    };

    describe('.className', function() {
        it('should return the namespaced class name', function() {
            const testee = type;
            expect(testee.className).to.be.equal(className);
        });
    });

    describe('.injections', function() {
        it('should return dependecies', function() {
            const testee = type;
            expect(testee.injections).to.be.ok;
        });
    });

    describe('#className', function() {
        it('should return the namespaced class name', function() {
            const testee = createTestee();
            expect(testee.className).to.be.equal(className);
        });
    });

    describe('#instanceId', function() {
        it('should return a unique instance id', function() {
            const testee = createTestee();
            const other = createTestee();
            expect(testee.instanceId).to.be.ok;
            expect(other.instanceId).to.be.ok;
            expect(testee.instanceId).to.be.not.equal(other.instanceId);
        });
    });

    describe('#logger', function() {
        it('should return a intel logger instance', function() {
            const testee = createTestee();
            expect(testee.logger).to.be.ok;
        });
    });

    describe('#toString()', function() {
        it('should return a string representation that contains the class name', function() {
            const testee = createTestee();
            expect(testee.toString()).to.contain(className);
        });
    });
}

/**
 * Api
 * @ignore
 */
module.exports.spec = spec;
