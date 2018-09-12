'use strict';

/**
 * Requirements
 */
require(ES_SOURCE + '/utils/prototypes.js');

/**
 * Spec
 */
describe('utils/prototypes', function() {
    describe('Number#format()', function() {
        it('should format to a digit count', function() {
            const testee = 1;
            expect(testee.format()).to.be.equal('1');
            expect(testee.format(3)).to.be.equal('001');
        });

        it('should format to a precision', function() {
            const testee = 1.23456789;
            expect(testee.format(1, 1)).to.be.equal('1.2');
            expect(testee.format(1, 4)).to.be.equal('1.2346');
        });
    });

    describe('String#urlify()', function() {
        it('should make string a valid url fragment', function() {
            expect('Löräm Üpsum!'.urlify()).to.be.equal('loram-upsum!');
        });
    });

    describe('String#dasherize()', function() {
        it('should replace all whitespace with dashes', function() {
            expect('Lorem ipsum_dolorem'.dasherize()).to.be.equal('Lorem-ipsum-dolorem');
        });
    });

    describe('String#lodasherize()', function() {
        it('should replace all whitespace with lodashes', function() {
            expect('Lorem ipsum-dolorem'.lodasherize()).to.be.equal('Lorem_ipsum_dolorem');
        });
    });

    describe('Object.values()', function() {
        it('should return all values of a object', function() {
            expect(Object.values({ foo: 'bar', baz: 'foz' })).to.be.deep.equal(['bar', 'foz']);
        });
    });

    describe('Object.keys()', function() {
        it('should return all keys of a object', function() {
            expect(Object.keys({ foo: 'bar', baz: 'foz' })).to.be.deep.equal(['foo', 'baz']);
        });
    });
});
