'use strict';

/**
 * Requirements
 */
const TestSuiteArray = require(ES_SOURCE + '/model/test/TestSuiteArray.js').TestSuiteArray;
const TestSuite = require(ES_SOURCE + '/model/test/TestSuite.js').TestSuite;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(TestSuiteArray.className, function()
{
    /**
     * Base Test
     */
    baseSpec(TestSuiteArray, 'model.test/TestSuiteArray');

    /**
     * TestSuiteArray Test
     */
    class ExampleTest extends TestSuite
    {
        /**
         * @inheritDocs
         */
        static get className()
        {
            return 'model.test/ExampleTest';
        }
    }

    describe('#getByType', function()
    {
        it('should return all tests of given type', function()
        {
            const testee = new TestSuiteArray();
            testee.push(new TestSuite({ name: 'Test1' }));
            testee.push(new ExampleTest({ name: 'Test2' }));
            const tests = testee.getByType(ExampleTest);
            expect(tests).to.have.length(1);
            expect(tests.find(item => item.name == 'Test2')).to.be.ok;
        });

        it('should return all tests of given type name', function()
        {
            const testee = new TestSuiteArray();
            testee.push(new TestSuite({ name: 'Test1' }));
            testee.push(new ExampleTest({ name: 'Test2' }));
            const tests = testee.getByType('ExampleTest');
            expect(tests).to.have.length(1);
            expect(tests.find(item => item.name == 'Test2')).to.be.ok;
        });

        it('should return a empty array when no tests were found', function()
        {
            const testee = new TestSuiteArray();
            const tests = testee.getByType('ExampleTest');
            expect(tests).to.have.length(0);
        });
    });


    describe('#getFirstByType', function()
    {
        it('should return the first example of given type', function()
        {
            const testee = new TestSuiteArray();
            testee.push(new TestSuite({ name: 'Test1' }));
            testee.push(new ExampleTest({ name: 'Test2' }));
            const test = testee.getFirstByType(ExampleTest);
            expect(test).to.be.ok;
            expect(test.name).to.be.equal('Test2');
        });

        it('should return the first example of given type name', function()
        {
            const testee = new TestSuiteArray();
            testee.push(new TestSuite({ name: 'Test1' }));
            testee.push(new ExampleTest({ name: 'Test2' }));
            const test = testee.getFirstByType('ExampleTest');
            expect(test).to.be.ok;
            expect(test.name).to.be.equal('Test2');
        });

        it('should return undefined when no example was found', function()
        {
            const testee = new TestSuiteArray();
            const test = testee.getFirstByType('ExampleTest');
            expect(test).to.be.not.ok;
        });
    });


    describe('#getByName', function()
    {
        it('should return the first example of given name', function()
        {
            const testee = new TestSuiteArray();
            testee.push(new TestSuite({ name: 'Test1' }));
            testee.push(new ExampleTest({ name: 'Test2' }));
            const test = testee.getByName('Test2');
            expect(test).to.be.ok;
            expect(test.name).to.be.equal('Test2');
        });

        it('should return undefined when no example was found', function()
        {
            const testee = new TestSuiteArray();
            const test = testee.getByName('ExampleTest');
            expect(test).to.be.not.ok;
        });
    });
});
