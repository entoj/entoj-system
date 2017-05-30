'use strict';

/**
 * Requirements
 * @ignore
 */
const linterSpec = require(ES_TEST + '/linter/LinterShared.js').spec;
const co = require('co');
const sinon = require('sinon');


/**
 * Shared FileLinter spec
 */
function spec(type, className, fixture, prepareParameters)
{
    /**
     * Linter Test
     */
    linterSpec(type, className, fixture);


    /**
     * FileLinter Test
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


    describe('#constructor', function()
    {
        it('should allow to configure glob via options', function()
        {
            const options =
            {
                glob: fixture.glob
            };
            const testee = createTestee({}, options);
            expect(testee.glob).to.contain(options.glob[0]);
        });
    });


    describe('#lint', function()
    {
        it('should resolve to an object containing all parsed files', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    glob: fixture.glob
                };
                const testee = createTestee({}, options);
                const result = yield testee.lint(fixture.root);
                expect(result).to.be.ok;
                expect(result.files).to.have.length(fixture.globCount);
            });
            return promise;
        });

        it('should lint each file that is matched by the given glob and root path', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    glob: fixture.glob
                };
                const testee = createTestee([], options);
                sinon.spy(testee, 'lintFile');
                yield testee.lint(fixture.root);
                expect(testee.lintFile.callCount).to.be.equal(fixture.globCount);
            });
            return promise;
        });

        it('should invoke the linter for each file that is matched by the given glob and root path', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    glob: fixture.glob
                };
                const testee = createTestee([], options);
                sinon.spy(testee.linter, 'lint');
                yield testee.lint(fixture.root);
                expect(testee.linter.lint.callCount).to.be.equal(fixture.globCount);
            });
            return promise;
        });

        it('should allow to override the glob per lint call', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    glob: fixture.glob
                };
                const testee = createTestee();
                sinon.spy(testee, 'lintFile');
                yield testee.lint(fixture.root, options);
                expect(testee.lintFile.callCount).to.be.equal(fixture.globCount);
            });
            return promise;
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
