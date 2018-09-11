'use strict';

/**
 * Requirements
 * @ignore
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const Environment = require('nunjucks').Environment;
const sinon = require('sinon');

/**
 * Shared tag spec
 */
function spec(type, className, tests, prepareParameters) {
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);

    /**
     * Tag Test
     */
    const createTestee = function() {
        let parameters = Array.from(arguments);
        if (prepareParameters) {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    describe('#register()', function() {
        it('should do nothing if not given a environment', function() {
            const testee = createTestee();
            testee.register();
            expect(testee.environment).to.be.not.ok;
        });

        it('should register the tag on the given environment', function() {
            const testee = createTestee();
            const environment = new Environment();
            testee.register(environment);
            expect(testee.environment).to.be.equal(environment);
            for (const name of testee.name) {
                expect(environment.getExtension(name)).to.be.ok;
            }
        });
    });

    describe('#generate()', function() {
        it('should parse all arguments of the tag and pass them to generate', function() {
            const testee = createTestee();
            const environment = new Environment();
            testee.register(environment);
            sinon.spy(testee, 'generate');
            const template =
                '{% ' +
                testee.name[0] +
                ' one=\'one\', two=2 %}' +
                (testee.hasBody ? '{% end' + testee.name[0] + ' %}' : '');
            environment.renderString(template);
            expect(testee.generate.calledOnce).to.be.ok;
            expect(testee.generate.getCall(0).args[1].one).to.be.equal('one');
            expect(testee.generate.getCall(0).args[1].two).to.be.equal(2);
        });
    });

    describe('rendering', function() {
        if (tests) {
            for (const test of tests) {
                it(test.name, function() {
                    const testee = createTestee();
                    const environment = new Environment(null, { autoescape: false });
                    testee.register(environment);
                    const result = environment.renderString(test.input);
                    expect(result).to.be.equal(test.expected);
                });
            }
        }
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
