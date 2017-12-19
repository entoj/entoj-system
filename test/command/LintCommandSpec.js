'use strict';

/**
 * Requirements
 */
const LintCommand = require(ES_SOURCE + '/command/LintCommand.js').LintCommand;
const commandSpec = require(ES_TEST + '/command/CommandShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const FileLinter = require(ES_SOURCE + '/linter/FileLinter.js').FileLinter;
const co = require('co');
const sinon = require('sinon');


/**
 * Spec
 */
describe(LintCommand.className, function()
{
    /**
     * Command Test
     */
    commandSpec(LintCommand, 'command/LintCommand', prepareParameters);

    // Adds necessary parameters to create a testee
    function prepareParameters(parameters)
    {
        global.fixtures = projectFixture.createDynamic();
        return [global.fixtures.context, global.fixtures.globalRepository, global.fixtures.pathesConfiguration, [], { exitCodes: false }];
    }


    /**
     * LintCommand Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createDynamic();
    });

    function createTestee(linters)
    {
        global.fixtures = projectFixture.createDynamic();
        return new LintCommand(global.fixtures.context, global.fixtures.globalRepository, global.fixtures.pathesConfiguration, linters, { exitCodes: false });
    }

    describe('#execute', function()
    {
        it('should apply all linter to all entities', function()
        {
            const promise = co(function*()
            {
                const linter = new FileLinter();
                sinon.spy(linter, 'lint');
                const testee = createTestee([linter]);
                yield testee.execute({ command: 'lint' });
                expect(linter.lint.callCount).to.be.equal(19);
            });
            return promise;
        });
    });
});
