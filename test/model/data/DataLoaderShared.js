'use strict';

/**
 * Requirements
 */
const loaderSpec = require('../LoaderShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');

/**
 * Shared DataLoader spec
 */
function spec(type, className, prepareParameters) {
    /**
     * Loader Test
     */
    loaderSpec(type, className, prepareParameters);

    /**
     * DataLoader Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createDynamic();
    });

    const createTestee = function() {
        let parameters = Array.from(arguments);
        if (prepareParameters) {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    describe('#load', function() {
        it('should resolve to a Data instance for the loaded file', function() {
            const testee = createTestee(ES_FIXTURES + '/model/TranslationsModel.json');
            const promise = co(function*() {
                const items = yield testee.load();
                expect(items.length).to.be.equal(1);
                expect(items.find((item) => item.site.name === 'Base')).to.be.ok;
            });
            return promise;
        });

        it('should resolve to Data instances for each loaded file from a site', function() {
            const testee = createTestee('${path.sites}/${site.name.urlify()}/translations.json');
            const promise = co(function*() {
                const items = yield testee.load();
                expect(items.length).to.be.equal(2);
                expect(items.find((item) => item.site.name === 'Base')).to.be.ok;
                expect(items.find((item) => item.site.name === 'Extended')).to.be.ok;
            });
            return promise;
        });
    });
}

/**
 * Exports
 */
module.exports = spec;
module.exports.spec = spec;
