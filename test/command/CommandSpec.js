'use strict';

/**
 * Requirements
 */
const Command = require(ES_SOURCE + '/command/Command.js').Command;
const Context = require(ES_SOURCE + '/application/Context.js').Context;
const commandSpec = require(ES_TEST + '/command/CommandShared.js').spec;


/**
 * Spec
 */
describe(Command.className, function()
{
    /**
     * Command Test
     */
    commandSpec(Command, 'command/Command', () => [new Context()]);
});
