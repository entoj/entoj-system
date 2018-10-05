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
describe(DIContainer.className, function() {
    /**
     * Base Test
     */
    baseSpec(DIContainer, 'utils/DIContainer');

    /**
     * DIContainer Test
     */
    class Color extends Base {
        constructor(name) {
            super();
            this.name = name;
        }

        static get className() {
            return 'Color';
        }

        static get injections() {
            return this._injections;
        }
    }

    class ShinyColor extends Color {
        static get className() {
            return 'ShinyColor';
        }

        static get injections() {
            return this._injections;
        }
    }

    class Car extends Base {
        constructor(color, options) {
            super();
            this.color = color;
            this.options = options;
        }

        static get className() {
            return 'Car';
        }

        static get injections() {
            return this._injections;
        }
    }

    class Dealer extends Base {
        constructor(cars, options) {
            super();
            this.cars = cars;
            this.options = options;
        }

        static get className() {
            return 'Dealer';
        }

        static get injections() {
            return this._injections;
        }
    }

    describe('#map', function() {
        it('should throw when given a falsy type', function() {
            const testee = new DIContainer();
            expect(() => testee.map()).to.throw();
        });

        it('should throw when given a undefined value', function() {
            const testee = new DIContainer();
            expect(() => testee.map('name')).to.throw();
        });

        it('should create a mapping', function() {
            const testee = new DIContainer();
            testee.map('name', 'Bruce');
            expect(testee.getMappingForType('name')).to.be.deep.equal({
                type: undefined,
                isSingleton: false,
                value: 'Bruce'
            });
        });

        it('should overwrite existing mappings', function() {
            const testee = new DIContainer();
            testee.map('name', Base, true);
            testee.map('name', 'Clark', false);
            expect(testee.getMappingForType('name')).to.be.deep.equal({
                type: undefined,
                isSingleton: false,
                value: 'Clark'
            });
        });

        it('should preserve the singleton flag from a existing mapping if not specified', function() {
            const testee = new DIContainer();
            testee.map(Base, Base, true);
            testee.map(Base, DIContainer);
            expect(testee.getMappingForType(Base)).to.be.deep.equal({
                type: DIContainer,
                isSingleton: true,
                value: undefined
            });
        });
    });

    describe('#mapAsSingleton', function() {
        it('should throw when given a falsy type', function() {
            const testee = new DIContainer();
            expect(() => testee.mapAsSingleton()).to.throw();
        });

        it('should uses type as vale when value is undefined', function() {
            const testee = new DIContainer();
            testee.mapAsSingleton(Base);
            expect(testee.getMappingForType(Base)).to.be.deep.equal({
                type: Base,
                isSingleton: true,
                value: undefined
            });
        });

        it('should create a singleton mapping', function() {
            const testee = new DIContainer();
            testee.mapAsSingleton(Base, Base);
            expect(testee.getMappingForType(Base)).to.be.deep.equal({
                type: Base,
                isSingleton: true,
                value: undefined
            });
        });
    });

    describe('#mapParameters', function() {
        it('should throw when given a falsy type', function() {
            const testee = new DIContainer();
            expect(() => testee.mapParameters()).to.throw();
        });

        it('should create a mapping for each named parameter', function() {
            const testee = new DIContainer();
            testee.mapParameters(Base, { name: 'Kent' });
            expect(testee.getMappingForType('Base.name')).to.be.deep.equal({
                type: undefined,
                isSingleton: false,
                value: 'Kent'
            });
        });

        it('should update a existing parameter mapping', function() {
            const testee = new DIContainer();
            testee.mapParameters(Base, { name: ['Clark'] });
            testee.mapParameters(Base, { name: ['Bruce'] });
            expect(testee.getMappingForType('Base.name')).to.be.deep.equal({
                type: undefined,
                isSingleton: false,
                value: ['Clark', 'Bruce']
            });
        });

        it('should replace a existing parameter mapping when replace = true', function() {
            const testee = new DIContainer();
            testee.mapParameters(Base, { name: ['Clark'] });
            testee.mapParameters(Base, { name: ['Bruce'] }, true);
            expect(testee.getMappingForType('Base.name')).to.be.deep.equal({
                type: undefined,
                isSingleton: false,
                value: ['Bruce']
            });
        });
    });

    describe('#mapViaConfiguration', function() {
        it('should throw when given a falsy configuration', function() {
            const testee = new DIContainer();
            expect(() => testee.mapViaConfiguration()).to.throw();
        });

        it('should throw when given no type', function() {
            const testee = new DIContainer();
            expect(() => testee.mapViaConfiguration({})).to.throw();
        });

        it('should create a mapping', function() {
            const testee = new DIContainer();
            testee.mapViaConfiguration({
                type: Base
            });
            expect(testee.getMappingForType(Base)).to.be.deep.equal({
                type: Base,
                isSingleton: false,
                value: undefined
            });
        });

        it('should allow to remap types', function() {
            const testee = new DIContainer();
            testee.map(Base, Base, true);
            testee.mapViaConfiguration({
                type: DIContainer,
                sourceType: Base
            });
            expect(testee.getMappingForType(Base)).to.be.deep.equal({
                type: DIContainer,
                isSingleton: true,
                value: undefined
            });
        });

        it('should update a existing mapping', function() {
            const testee = new DIContainer();
            testee.map(Base, Base, true);
            testee.mapViaConfiguration({
                type: Base
            });
            expect(testee.getMappingForType(Base)).to.be.deep.equal({
                type: Base,
                isSingleton: true,
                value: undefined
            });
        });

        it('should allow to map named parameters', function() {
            const testee = new DIContainer();
            testee.mapViaConfiguration({
                type: Base,
                parameters: [['name', 'Clark']]
            });
            expect(testee.getMappingForType('Base.name')).to.be.deep.equal({
                type: undefined,
                isSingleton: false,
                value: 'Clark'
            });
        });

        it('should update a existing parameter mapping', function() {
            const testee = new DIContainer();
            testee.mapViaConfiguration({
                type: Base,
                parameters: [['name', ['Clark']]]
            });
            testee.mapViaConfiguration({
                type: Base,
                parameters: [['name', ['Bruce']]]
            });
            expect(testee.getMappingForType('Base.name')).to.be.deep.equal({
                type: undefined,
                isSingleton: false,
                value: ['Clark', 'Bruce']
            });
        });

        it('should replace a existing parameter mapping when replace = true', function() {
            const testee = new DIContainer();
            testee.mapViaConfiguration({
                type: Base,
                parameters: [['name', 'Clark']]
            });
            testee.mapViaConfiguration(
                {
                    type: Base,
                    parameters: [['name', 'Bruce']]
                },
                true
            );
            expect(testee.getMappingForType('Base.name')).to.be.deep.equal({
                type: undefined,
                isSingleton: false,
                value: 'Bruce'
            });
        });
    });

    describe('#getMappingForDerivatives', function() {
        it('should throw when given a non class type', function() {
            const testee = new DIContainer();
            expect(() => testee.getMappingForDerivatives()).to.throw();
        });

        it('should return a list of mappings', function() {
            const testee = new DIContainer();
            testee.map(Color, Color);
            testee.map(ShinyColor, ShinyColor);
            expect(testee.getMappingForDerivatives(Base)).to.be.deep.equal([
                {
                    type: Color,
                    isSingleton: false,
                    value: undefined
                },
                {
                    type: ShinyColor,
                    isSingleton: false,
                    value: undefined
                }
            ]);
        });
    });

    describe('#create', function() {
        it('should throw when giving a falsy type to create', function() {
            const testee = new DIContainer();
            expect(() => testee.create()).to.throw();
        });

        it('should return a instance of given type', function() {
            const testee = new DIContainer();
            expect(testee.create(Color)).to.be.instanceof(Color);
        });

        it('should return the value for given name', function() {
            const testee = new DIContainer();
            const color = new Color();
            testee.map('color', color);
            expect(testee.create('color')).to.be.equal(color);
        });

        it('should resolve name based dependencies', function() {
            const testee = new DIContainer();
            const color = new Color();
            testee.map('color', color);
            Car._injections = { parameters: ['color'] };
            expect(testee.create(Car).color).to.be.equal(color);
        });

        it('should resolve type based dependencies', function() {
            const testee = new DIContainer();
            Car._injections = { parameters: [Color] };
            expect(testee.create(Car).color).to.be.instanceof(Color);
        });

        it('should throw when maping falsy types', function() {
            const testee = new DIContainer();
            expect(() => testee.map()).to.throw(TypeError);
            expect(() => testee.map(Color)).to.throw(TypeError);
        });

        it('should allow to remap types', function() {
            const testee = new DIContainer();
            testee.map(Color, ShinyColor);
            Car._injections = { parameters: [Color] };
            expect(testee.create(Car).color).to.be.instanceof(ShinyColor);
        });

        it('should use the injections of the remaped type', function() {
            const testee = new DIContainer();
            testee.map(Color, ShinyColor);
            testee.map('Color.name', 'red');
            testee.map('ShinyColor.name', 'green');

            Color._injections = { parameters: ['Color.name'] };
            ShinyColor._injections = { parameters: ['ShinyColor.name'] };
            Car._injections = { parameters: [Color] };

            const car = testee.create(Car);
            expect(car.color.name).to.be.equal('green');
        });

        it('should allow to map types as singletons', function() {
            const testee = new DIContainer();
            testee.map(Car, Car, true);
            testee.map(Color, ShinyColor, true);
            Car._injections = { parameters: [Color] };
            expect(testee.create(Car)).to.be.equal(testee.create(Car));
            expect(testee.create(Car).color).to.be.instanceof(ShinyColor);
            expect(testee.create(Car).color).to.be.equal(testee.create(Car).color);
        });

        it('should allow to map same type as singleton', function() {
            const testee = new DIContainer();
            testee.map(Color, Color, true);
            Car._injections = { parameters: [Color] };
            expect(testee.create(Car).color).to.be.instanceof(Color);
            expect(testee.create(Car).color).to.be.equal(testee.create(Car).color);
        });

        it('should allow to map types to a instance', function() {
            const testee = new DIContainer();
            const color = new ShinyColor();
            testee.map(Color, color);
            Car._injections = { parameters: [Color] };
            expect(testee.create(Car).color).to.be.equal(color);
            expect(testee.create(Car).color).to.be.equal(color);
        });

        describe('mode=instance', function() {
            it('should ensure to create a instance when given a class as a named parameter', function() {
                const testee = new DIContainer();
                testee.map('color', ShinyColor);
                Car._injections = { parameters: ['color'], modes: ['instance'] };
                const car = testee.create(Car);
                expect(car).to.be.instanceof(Car);
                expect(car.color).to.be.instanceof(ShinyColor);
            });

            it('should ensure to create a instance when given a configuration as a named parameter', function() {
                const testee = new DIContainer();
                testee.map('color', {
                    type: ShinyColor
                });
                Car._injections = { parameters: ['color'], modes: ['instance'] };
                const car = testee.create(Car);
                expect(car).to.be.instanceof(Car);
                expect(car.color).to.be.instanceof(ShinyColor);
            });

            it('should ensure to create instances when given a class or configuration in a array', function() {
                const testee = new DIContainer();
                testee.map(Color, ShinyColor);
                testee.map('cars', [
                    new Car(),
                    Car,
                    {
                        type: Car,
                        arguments: [[Color, Color]]
                    }
                ]);
                Car._injections = { parameters: [Color] };
                Dealer._injections = { parameters: ['cars'], modes: ['instance'] };
                const dealer = testee.create(Dealer);
                expect(dealer.cars).to.have.length(3);
                expect(dealer.cars[0]).to.be.instanceof(Car);
                expect(dealer.cars[1]).to.be.instanceof(Car);
                expect(dealer.cars[1].color).to.be.instanceof(ShinyColor);
                expect(dealer.cars[2]).to.be.instanceof(Car);
                expect(dealer.cars[2].color).to.be.instanceof(Color);
            });
        });

        it('should allow to override mappings', function() {
            const testee = new DIContainer();
            testee.map(Color, ShinyColor);
            const override = new Map();
            override.set('options', 'Test');
            Car._injections = { parameters: [Color, 'options'] };
            expect(testee.create(Car, override).color).to.be.instanceof(ShinyColor);
            expect(testee.create(Car, override).options).to.be.equal('Test');
        });
    });
});
