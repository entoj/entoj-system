'use strict';

/**
 * Requirements
 */
const BaseMap = require(ES_SOURCE + '/base/BaseMap.js').BaseMap;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Spec
 */
describe(BaseMap.className, function() {
    /**
     * Base Test
     */
    baseSpec(BaseMap, 'base/BaseMap');

    /**
     * BaseMap Test
     */
    const createTestee = function(...parameters) {
        return new BaseMap(...parameters);
    };

    describe('#constructor', function() {
        it('should allow to initilize map with a iterable', function() {
            const testee = createTestee({ foo: 'bar' });

            expect(testee.get('foo')).to.be.equal('bar');
        });
    });

    describe('#events', function() {
        it('should be a EventEmitter', function() {
            const testee = createTestee();
            expect(testee.events).to.be.instanceof(require('events').EventEmitter);
        });

        it('should emit a change event on set', function(cb) {
            const testee = createTestee();
            testee.events.on('change', (e) => {
                cb();
            });
            testee.set('one', 'two');
        });

        it('should emit a change event on clear', function(cb) {
            const testee = createTestee();
            testee.events.on('change', (e) => {
                cb();
            });
            testee.clear();
        });

        it('should emit a change event on delete', function(cb) {
            const testee = createTestee();
            testee.events.on('change', (e) => {
                cb();
            });
            testee.delete('one');
        });
    });

    describe('#getByPath', function() {
        it('should return defaultValue when no path is given', function() {
            const testee = createTestee();

            expect(testee.getByPath(false, 'not found')).to.be.equal('not found');
        });

        it('should return defaultValue when path is not found', function() {
            const testee = createTestee();

            expect(testee.getByPath('simple', 'not found')).to.be.equal('not found');
        });

        it('should allow to get a value by path', function() {
            const testee = createTestee();
            testee.set('simple', 'simple');

            expect(testee.getByPath('simple')).to.be.equal('simple');
        });

        it('should support objects', function() {
            const testee = createTestee();
            testee.set('object', { path: { to: 'object' } });

            expect(testee.getByPath('object.path.to')).to.be.equal('object');
        });

        it('should support maps', function() {
            const testee = createTestee();
            const map1 = new Map();
            const map2 = new Map();
            map2.set('to', 'map');
            map1.set('path', map2);
            testee.set('map', map1);

            expect(testee.getByPath('map.path.to')).to.be.equal('map');
        });

        it('should support wildcards at the end of a path', function() {
            const testee = createTestee();
            testee.set('object', { path: { to: 'object', other: 'wildcard' } });

            expect(testee.getByPath('object.path.*')).to.be.deep.equal({ to: 'object', other: 'wildcard' });
        });

        it('should return undefined when path is not found and no defaultValue given', function() {
            const testee = createTestee();
            testee.set('object', { path: { to: 'object' } });

            expect(testee.getByPath('object.path.from')).to.be.equal(undefined);
        });

        it('should return the defaultValue when path is not found', function() {
            const testee = createTestee();

            expect(testee.getByPath('object.path.to', 'Default')).to.be.equal('Default');
        });
    });

    describe('#setByPath', function() {
        it('should set the value at the given path', function() {
            const testee = createTestee();
            testee.set('map', new Map());
            testee.set('object', {});
            testee.setByPath('map.name', 'Map');
            testee.setByPath('object.name', 'Object');
            testee.setByPath('very.long.path.to', 'Path');

            expect(testee.getByPath('map.name')).to.be.equal('Map');
            expect(testee.getByPath('object.name')).to.be.equal('Object');
            expect(testee.getByPath('very.long.path.to')).to.be.equal('Path');
        });

        it('should overwrite the value at the given path', function() {
            const testee = createTestee();
            testee.set('object', { name: 'Object' });
            testee.setByPath('object.name', 'Overwritten');

            expect(testee.getByPath('object.name')).to.be.equal('Overwritten');
        });
    });

    describe('#load', function() {
        it('should allow to import a Map', function() {
            const testee = createTestee();
            const data = new Map();
            data.set('foo', 'bar');

            testee.load(data);
            expect(testee.get('foo')).to.be.equal('bar');
        });

        it('should allow to import a BaseMap', function() {
            const testee = createTestee();
            const data = createTestee();
            data.set('foo', 'bar');

            testee.load(data);
            expect(testee.get('foo')).to.be.equal('bar');
        });

        it('should allow to import a Object', function() {
            const testee = createTestee();
            const data = {
                foo: 'bar'
            };

            testee.load(data);
            expect(testee.get('foo')).to.be.equal('bar');
        });

        it('should preserve existing items', function() {
            const testee = createTestee();
            testee.set('bar', 'foo');
            const data = {
                foo: 'bar'
            };

            testee.load(data);
            expect(testee.get('foo')).to.be.equal('bar');
            expect(testee.get('bar')).to.be.equal('foo');
        });

        it('should allow to clear items before loading', function() {
            const testee = createTestee();
            testee.set('bar', 'foo');
            const data = {
                foo: 'bar'
            };

            testee.load(data, true);
            expect(testee.get('foo')).to.be.equal('bar');
            expect(testee.get('bar')).to.be.not.ok;
        });

        it('should do nothing when given non iterable data', function() {
            const testee = createTestee();

            testee.load(undefined);
            expect(testee.size).to.be.equal(0);
        });
    });

    describe('#merge', function() {
        it('should just swallow falsy values', function() {
            const testee = createTestee();
            testee.merge();
            testee.merge(null);
            testee.merge(false);
        });

        it('should allow to merge a Map', function() {
            const testee = createTestee();
            testee.set('foo', { value: 'bar', version: 1 });
            const data = new Map();
            data.set('foo', { version: 2 });

            testee.merge(data);
            expect(testee.getByPath('foo.value')).to.be.equal('bar');
            expect(testee.getByPath('foo.version')).to.be.equal(2);
        });

        it('should allow to merge a BaseMap', function() {
            const testee = createTestee();
            testee.set('foo', { value: 'bar', version: 1 });
            const data = new BaseMap();
            data.set('foo', { version: 2 });

            testee.merge(data);
            expect(testee.getByPath('foo.value')).to.be.equal('bar');
            expect(testee.getByPath('foo.version')).to.be.equal(2);
        });

        it('should allow to merge a Object', function() {
            const testee = createTestee();
            testee.set('foo', { value: 'bar', version: 1 });
            const data = {
                foo: {
                    version: 2
                }
            };

            testee.merge(data);
            expect(testee.getByPath('foo.value')).to.be.equal('bar');
            expect(testee.getByPath('foo.version')).to.be.equal(2);
        });
    });
});
