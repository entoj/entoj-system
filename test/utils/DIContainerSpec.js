'use strict';

/**
 * Requirements
 */
const Base = require(ES_SOURCE + '/Base.js').Base;
const DIContainer = require(ES_SOURCE + '/utils/DIContainer.js').DIContainer;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Spec
 */
describe(DIContainer.className, function()
{
    /**
     * Base Test
     */
    baseSpec(DIContainer, 'utils/DIContainer');


    /**
     * DIContainer Test
     */
    class Color extends Base
    {
        constructor(name)
        {
            super();
            this.name = name;
        }

        static get className()
        {
            return 'Color';
        }

        static get injections()
        {
            return this._injections;
        }
    }

    class ShinyColor extends Color
    {
        static get className()
        {
            return 'ShinyColor';
        }

        static get injections()
        {
            return this._injections;
        }
    }

    class Car extends Base
    {
        constructor(color, options)
        {
            super();
            this.color = color;
            this.options = options;
        }

        static get className()
        {
            return 'Car';
        }

        static get injections()
        {
            return this._injections;
        }
    }


    describe('#create & #map', function()
    {
        it('should return undefined if given type is falsy', function()
        {
            const testee = new DIContainer();
            expect(testee.create()).to.be.undefined;
        });

        it('should return a instance of given type', function()
        {
            const testee = new DIContainer();
            expect(testee.create(Color)).to.be.instanceof(Color);
        });

        it('should return the value for given name', function()
        {
            const testee = new DIContainer();
            const color = new Color();
            testee.map('color', color);
            expect(testee.create('color')).to.be.equal(color);
        });

        it('should resolve name based dependencies', function()
        {
            const testee = new DIContainer();
            const color = new Color();
            testee.map('color', color);
            Car._injections = { 'parameters': ['color'] };
            expect(testee.create(Car).color).to.be.equal(color);
        });

        it('should resolve type based dependencies', function()
        {
            const testee = new DIContainer();
            Car._injections = { 'parameters': [Color] };
            expect(testee.create(Car).color).to.be.instanceof(Color);
        });

        it('should throw when maping falsy types', function()
        {
            const testee = new DIContainer();
            expect(() => testee.map()).to.throw(TypeError);
            expect(() => testee.map(Color)).to.throw(TypeError);
        });

        it('should allow to remap types', function()
        {
            const testee = new DIContainer();
            testee.map(Color, ShinyColor);
            Car._injections = { 'parameters': [Color] };
            expect(testee.create(Car).color).to.be.instanceof(ShinyColor);
        });

        it('should use the injections of the remaped type', function()
        {
            const testee = new DIContainer();
            testee.map(Color, ShinyColor);
            testee.map('Color.name', 'red');
            testee.map('ShinyColor.name', 'green');

            Color._injections = { 'parameters': ['Color.name'] };
            ShinyColor._injections = { 'parameters': ['ShinyColor.name'] };
            Car._injections = { 'parameters': [Color] };

            const car = testee.create(Car);
            expect(car.color.name).to.be.equal('green');
        });

        it('should allow to map types as singletons', function()
        {
            const testee = new DIContainer();
            testee.map(Car, Car, true);
            testee.map(Color, ShinyColor, true);
            Car._injections = { 'parameters': [Color] };
            expect(testee.create(Car)).to.be.equal(testee.create(Car));
            expect(testee.create(Car).color).to.be.instanceof(ShinyColor);
            expect(testee.create(Car).color).to.be.equal(testee.create(Car).color);
        });

        it('should allow to map same type as singleton', function()
        {
            const testee = new DIContainer();
            testee.map(Color, Color, true);
            Car._injections = { 'parameters': [Color] };
            expect(testee.create(Car).color).to.be.instanceof(Color);
            expect(testee.create(Car).color).to.be.equal(testee.create(Car).color);
        });

        it('should allow to map types to a instance', function()
        {
            const testee = new DIContainer();
            const color = new ShinyColor();
            testee.map(Color, color);
            Car._injections = { 'parameters': [Color] };
            expect(testee.create(Car).color).to.be.equal(color);
            expect(testee.create(Car).color).to.be.equal(color);
        });

        it('should allow to override mappings', function()
        {
            const testee = new DIContainer();
            testee.map(Color, ShinyColor);
            const override = new Map();
            override.set('options', 'Test');
            Car._injections = { 'parameters': [Color, 'options'] };
            expect(testee.create(Car, override).color).to.be.instanceof(ShinyColor);
            expect(testee.create(Car, override).options).to.be.equal('Test');
        });
    });
});
