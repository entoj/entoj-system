'use strict';

/**
 * Requirements
 */
const Loader = require(ES_SOURCE + '/model/Loader.js').Loader;
const ValueObject = require(ES_SOURCE + '/model/ValueObject.js').ValueObject;
const co = require('co');
const sinon = require('sinon');
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Shared Repository Spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);


    /**
     * Repository Test
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


    /**
     * Test Loader
     */
    class TestLoader extends Loader
    {
        constructor(items, updates)
        {
            super(items);
            this._updates = updates || [];
        }

        load(items)
        {
            if (items)
            {
                return Promise.resolve(this._updates);
            }
            return Promise.resolve(this._items);
        }
    }


    /**
     * Test ValueObject
     */
    class TestValueObject extends ValueObject
    {
        constructor(id, name)
        {
            super({ id: id, name: name});
        }

        initialize()
        {
            super.initialize();
            this.id = '';
            this.name = '';
        }

        get fields()
        {
            const fields = super.fields;
            fields.name = '';
            fields.id = '';
            return fields;
        }

        get uniqueId()
        {
            return this.id;
        }
    }

    beforeEach(function()
    {
        global.fixtures = {};
        global.fixtures.item1 = { name: 'One', number: 1, category: 'one' };
        global.fixtures.item2 = { name: 'Two', number: 2, category: 'one' };
        global.fixtures.item3 = { name: 'Three', number: 3, uniqueId: 'uid', category: 'two' };
        global.fixtures.item4 = { name: 'Four', number: 4, uniqueId: 'uid', category: 'two' };

        global.fixtures.addItems = function *(testee)
        {
            yield testee.add(global.fixtures.item1);
            yield testee.add(global.fixtures.item2);
            yield testee.add(global.fixtures.item3);
            yield testee.add(global.fixtures.item4);
        };
    });


    describe('#invalidate', function()
    {
        it('should load all items when called with no arguments', function()
        {
            const data =
            [
                {
                    name:'John'
                }
            ];
            const loader = new Loader(data);
            sinon.spy(loader, 'load');
            const testee = createTestee(loader);
            const promise = co(function *()
            {
                yield testee.getItems();
                yield testee.invalidate();
                expect(loader.load.calledTwice).to.be.ok;
            });
            return promise;
        });

        it('should allow to update existing items', function()
        {
            const data =
            [
                new TestValueObject(1, 'Jim'),
                new TestValueObject(2, 'John')
            ];
            const load =
            [
                new TestValueObject(2, 'John Boy'),
            ];
            const loader = new TestLoader(data, load);
            const testee = createTestee(loader);
            const promise = co(function *()
            {
                yield testee.getItems();
                yield testee.invalidate({ add: [2] });
                const items = yield testee.getItems();
                expect(items).to.have.length(2);
                expect(items.find(item => item.uniqueId === 1).name).to.be.equal('Jim');
                expect(items.find(item => item.uniqueId === 2).name).to.be.equal('John Boy');
            });
            return promise;
        });

        it('should allow to add new items', function()
        {
            const data =
            [
                new TestValueObject(1, 'Jim')
            ];
            const load =
            [
                new TestValueObject(2, 'John')
            ];
            const loader = new TestLoader(data, load);
            const testee = createTestee(loader);
            const promise = co(function *()
            {
                yield testee.getItems();
                yield testee.invalidate({ add: [2] });
                const items = yield testee.getItems();
                expect(items).to.have.length(2);
                expect(items.find(item => item.uniqueId === 1).name).to.be.equal('Jim');
                expect(items.find(item => item.uniqueId === 2).name).to.be.equal('John');
            });
            return promise;
        });

        it('should allow to remove existing items', function()
        {
            const data =
            [
                new TestValueObject(1, 'Jim'),
                new TestValueObject(2, 'John')
            ];
            const load =
            [
            ];
            const loader = new TestLoader(data, load);
            const testee = createTestee(loader);
            const promise = co(function *()
            {
                yield testee.getItems();
                yield testee.invalidate({ remove: [2] });
                const items = yield testee.getItems();
                expect(items).to.have.length(1);
                expect(items.find(item => item.uniqueId === 1).name).to.be.equal('Jim');
            });
            return promise;
        });

        it('should resolve to an object describing all changes', function()
        {
            const vos =
            [
                new TestValueObject(1, 'Jim'),
                new TestValueObject(2, 'John'),
                new TestValueObject(3, 'Bob')
            ];
            const data =
            [
                vos[0],
                vos[1]
            ];
            const load =
            [
                new TestValueObject(2, 'John Boy'),
                vos[2]
            ];
            const expected =
            {
                'add':
                [
                    vos[2]
                ],
                'update':
                [
                    vos[1]
                ],
                'remove':
                [
                    vos[0]
                ]
            };
            const loader = new TestLoader(data, load);
            const testee = createTestee(loader);
            const promise = co(function *()
            {
                yield testee.getItems();
                const changes = yield testee.invalidate({ add: [2, 3], remove: [1] });
                expect(changes).to.be.deep.equal(expected);
            });
            return promise;
        });
    });


    describe('#add()', function()
    {
        it('should allow to add items', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield testee.add(global.fixtures.item1);
                yield testee.add(global.fixtures.item2, global.fixtures.item3);
                const items = yield testee.getItems();
                expect(items).to.have.members([global.fixtures.item1, global.fixtures.item2, global.fixtures.item3]);
            });
            return promise;
        });

        it('should dispatch signals.added after adding items', function(cb)
        {
            const testee = createTestee();
            co(function *()
            {
                testee.signals.added.add(function(repository, items)
                {
                    expect(repository).to.be.equal(testee);
                    expect(items).to.have.length(1);
                    expect(items[0]).to.be.equal(global.fixtures.item1);
                    cb();
                });
                yield testee.add(global.fixtures.item1);
            });
        });
    });


    describe('#remove()', function()
    {
        it('should allow to remove items by instance', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield testee.add(global.fixtures.item1, global.fixtures.item2, global.fixtures.item3);
                yield testee.remove(global.fixtures.item1, global.fixtures.item3);
                const items = yield testee.getItems();
                expect(items).to.have.length(1);
                expect(items[0]).to.be.equal(global.fixtures.item2);
            });
            return promise;
        });

        it('should allow to remove items by uniqueId', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield testee.add(global.fixtures.item3, global.fixtures.item2);
                yield testee.remove(global.fixtures.item3.uniqueId);
                const items = yield testee.getItems();
                expect(items).to.have.length(1);
                expect(items[0]).to.be.equal(global.fixtures.item2);
            });
            return promise;
        });

        it('should remove all items that match', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield testee.add(global.fixtures.item1, global.fixtures.item2, global.fixtures.item1);
                yield testee.remove(global.fixtures.item1);
                const items = yield testee.getItems();
                expect(items).to.have.length(1);
                expect(items[0]).to.be.equal(global.fixtures.item2);
            });
            return promise;
        });

        it('should dispatch signals.removed after removing items', function(cb)
        {
            const testee = createTestee();
            co(function *()
            {
                testee.signals.removed.add(function(repository, items)
                {
                    expect(repository).to.be.equal(testee);
                    expect(items).to.have.length(1);
                    expect(items[0]).to.be.equal(global.fixtures.item1);
                    cb();
                });
                yield testee.add(global.fixtures.item1, global.fixtures.item2);
                yield testee.remove(global.fixtures.item1);
            });
        });
    });


    describe('#replace()', function()
    {
        it('should allow to replace items by their uniqueIds', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield testee.add(global.fixtures.item1, global.fixtures.item2, global.fixtures.item3);
                yield testee.replace(global.fixtures.item4);
                const items = yield testee.getItems();
                expect(items).to.have.length(3);
                expect(items[0]).to.be.equal(global.fixtures.item1);
                expect(items[1]).to.be.equal(global.fixtures.item2);
                expect(items[2]).to.be.equal(global.fixtures.item4);
            });
            return promise;
        });

        it('should dispatch signals.replaced after replacing items', function(cb)
        {
            const testee = createTestee();
            co(function *()
            {
                testee.signals.replaced.add(function(repository, items)
                {
                    expect(repository).to.be.equal(testee);
                    expect(items[0]).to.be.equal(global.fixtures.item4);
                    cb();
                });
                yield testee.add(global.fixtures.item1, global.fixtures.item2, global.fixtures.item3);
                yield testee.replace(global.fixtures.item4);
            });
        });
    });


    describe('#getItems', function()
    {
        it('should trigger a load on the configured loader', function()
        {
            const loader = new Loader([{ name:'John' }]);
            sinon.spy(loader, 'load');
            const testee = createTestee(loader);
            const promise = co(function *()
            {
                yield testee.getItems(testee);
                expect(loader.load.calledOnce).to.be.ok;
                const items = yield testee.getPropertyList('name');
                expect(items).to.have.members(['John']);
            });
            return promise;
        });

        it('should trigger a load on the configured loader only once', function()
        {
            const loader = new Loader([{ name:'John' }]);
            sinon.spy(loader, 'load');
            const testee = createTestee(loader);
            const promise = co(function *()
            {
                yield testee.getItems(testee);
                yield testee.getItems(testee);
                yield testee.getItems(testee);
                expect(loader.load.calledOnce).to.be.ok;
            });
            return promise;
        });
    });


    describe('#getPropertyList()', function()
    {
        it('should allow to get a list of item properties', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield global.fixtures.addItems(testee);
                const items = yield testee.getPropertyList('name');
                expect(items).to.have.members(['One', 'Two', 'Three', 'Four']);
            });
            return promise;
        });
    });


    describe('#findBy()', function()
    {
        it('should allow to find a item by a property value', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield global.fixtures.addItems(testee);
                const item = yield testee.findBy({ 'name': 'One' });
                expect(item).to.be.equal(global.fixtures.item1);
            });
            return promise;
        });

        it('should allow multiple properties', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield global.fixtures.addItems(testee);
                const item = yield testee.findBy({ '*': 2 });
                expect(item).to.be.equal(global.fixtures.item2);
            });
            return promise;
        });

        it('should ignore case', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield global.fixtures.addItems(testee);
                const item = yield testee.findBy({ 'name': 'two' });
                expect(item).to.be.equal(global.fixtures.item2);
            });
            return promise;
        });

        it('should allow regular expessions', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield global.fixtures.addItems(testee);
                const item = yield testee.findBy({ 'name': /two/i });
                expect(item).to.be.equal(global.fixtures.item2);
            });
            return promise;
        });

        it('should resolve to undefined when item was not found', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield global.fixtures.addItems(testee);
                const item = yield testee.findBy({ 'name': 'Foo' });
                expect(item).to.be.not.ok;
            });
            return promise;
        });
    });


    describe('#filterBy()', function()
    {
        it('should allow to filter items by a property value', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield global.fixtures.addItems(testee);
                const items = yield testee.filterBy({ 'name': 'One' });
                expect(items).to.have.length(1);
                expect(items[0]).to.be.equal(global.fixtures.item1);
            });
            return promise;
        });

        it('should ignore case', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield global.fixtures.addItems(testee);
                const items = yield testee.filterBy({ 'name': 'three' });
                expect(items).to.have.length(1);
                expect(items[0]).to.be.equal(global.fixtures.item3);
            });
            return promise;
        });

        it('should allow to filter items by a regex', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield global.fixtures.addItems(testee);
                const items = yield testee.filterBy({ 'name': /^T/ });
                expect(items).to.have.length(2);
                expect(items[0]).to.be.equal(global.fixtures.item2);
                expect(items[1]).to.be.equal(global.fixtures.item3);
            });
            return promise;
        });

        it('should allow multiple properties', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield global.fixtures.addItems(testee);
                const items = yield testee.filterBy({ 'name': 'Two', number: 2 });
                expect(items).to.have.length(1);
                expect(items[0]).to.be.equal(global.fixtures.item2);
            });
            return promise;
        });

        it('should yield a empty array when nothing matched', function()
        {
            const testee = createTestee();
            const promise = co(function *()
            {
                yield global.fixtures.addItems(testee);
                const items = yield testee.filterBy({ 'name': 'Nope' });
                expect(items).to.have.length(0);
            });
            return promise;
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
