'use strict';

/**
 * Requirements
 */
const assertParameter = require(ES_SOURCE + '/utils/assert.js').assertParameter;
const MissingArgumentError = require(ES_SOURCE + '/error/MissingArgumentError.js').MissingArgumentError;
const Base = require(ES_SOURCE + '/Base.js').Base;


/**
 * Spec
 */
describe('utils/assert', function()
{
    describe('#assertParameter', function()
    {
        it('should throw if instance is missing', function()
        {
            expect(() => assertParameter()).to.throw(TypeError);
        });

        it('should be ok with no parameters except instance', function()
        {
            const instance = new Base();
            expect(() => assertParameter(instance)).to.not.throw();
        });

        it('should make sure a parameter is required', function()
        {
            const instance = new Base();
            expect(() => assertParameter(instance, 'name', undefined, false)).to.not.throw(MissingArgumentError);
            expect(() => assertParameter(instance, 'name', undefined, true)).to.throw(MissingArgumentError);
        });

        it('should make sure a parameter has a specific type', function()
        {
            const instance = new Base();
            expect(() => assertParameter(instance, 'name', 'Hell Yeah', true, Base)).to.throw(TypeError);
            expect(() => assertParameter(instance, 'name', instance, true, Base)).to.not.throw(TypeError);
        });

        it('should make sure a parameter that is not required maybe falsy', function()
        {
            const instance = new Base();
            expect(() => assertParameter(instance, 'name', false, false, Base)).to.not.throw(TypeError);
            expect(() => assertParameter(instance, 'name', undefined, false, Base)).to.not.throw(TypeError);
        });
    });
});
