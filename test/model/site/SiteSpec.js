'use strict';

/**
 * Requirements
 */
const Site = require(ES_SOURCE + '/model/site/Site.js').Site;
const baseSpec = require('../../BaseShared.js').spec;
const documentableValueObjectSpec = require('../DocumentableValueObjectShared.js').spec;
const co = require('co');

/**
 * Spec
 */
describe(Site.className, function() {
    /**
     * ValueObject Test
     */
    documentableValueObjectSpec(Site, 'model.site/Site', function(parameters) {
        parameters.unshift({ name: 'base' });
        return parameters;
    });

    /**
     * Site Test
     */
    baseSpec.assertProperty(Site, ['NAME', 'ANY']);
    baseSpec.assertProperty(new Site(), ['name'], 'foo', '');
    baseSpec.assertProperty(new Site(), ['description'], 'bar', '');
    baseSpec.assertProperty(new Site(), ['extends'], 'bar', false);

    describe('#constructor()', function() {
        it('should allow to configure name and description', function() {
            const testee = new Site({ name: 'base', description: 'Default template' });
            expect(testee.name).to.equal('base');
            expect(testee.description).to.equal('Default template');
        });
    });

    describe('#uniqueId', function() {
        it('should return the site name', function() {
            const testee = new Site({ name: 'base' });
            expect(testee.uniqueId).to.be.equal('base');
        });
    });

    describe('#isEqualTo', function() {
        it('should return true when both sites have the same name', function() {
            const testee = new Site({ name: 'base' });
            const other = new Site({ name: 'base' });
            expect(testee.isEqualTo(other)).to.be.ok;
        });

        it('should return false when both objects dont have the same name', function() {
            const testee = new Site({ name: 'base' });
            const other = new Site({ name: 'landingpage' });
            expect(testee.isEqualTo(other)).to.be.not.ok;
        });
    });

    xdescribe('#update', function() {
        it('should allow to update name', function() {
            const promise = co(function*() {
                const data = new Site('base');
                const testee = new Site('landingpage');
                yield testee.update(data);
                expect(testee.name).to.be.equal(data.name);
            });
            return promise;
        });
    });
});
