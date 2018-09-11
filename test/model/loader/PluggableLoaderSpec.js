'use strict';

/**
 * Requirements
 */
const LoaderPlugin = require(ES_SOURCE + '/model/loader/LoaderPlugin.js').LoaderPlugin;
const PluggableLoader = require(ES_SOURCE + '/model/loader/PluggableLoader.js').PluggableLoader;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const loaderSpec = require('../LoaderShared.js').spec;
const sinon = require('sinon');
const co = require('co');

/**
 * Spec
 */
describe(PluggableLoader.className, function() {
    /**
     * Loade Test
     */
    loaderSpec(PluggableLoader, 'model.loader/PluggableLoader');

    /**
     * PluggableLoader Test
     */
    baseSpec.assertProperty(new PluggableLoader(), ['plugins'], undefined, []);

    describe('#load', function() {
        it('should execute each registered plugin for each loaded item', function() {
            const plugin1 = new LoaderPlugin();
            sinon.spy(plugin1, 'execute');
            const plugin2 = new LoaderPlugin();
            sinon.spy(plugin2, 'execute');
            const loader = new PluggableLoader([plugin1, plugin2], ['item1', 'item2']);
            const promise = co(function*() {
                const items = yield loader.load();
                expect(items).to.have.length(2);
                expect(plugin1.execute.calledTwice).to.be.ok;
                expect(plugin2.execute.calledTwice).to.be.ok;
            });
            return promise;
        });

        it('should allow to customize the loaded items via the finalize method', function() {
            const loader = new PluggableLoader([], ['item1', 'item2']);
            sinon.spy(loader, 'finalize');
            const promise = co(function*() {
                yield loader.load();
                expect(loader.finalize.calledOnce).to.be.ok;
            });
            return promise;
        });
    });
});
