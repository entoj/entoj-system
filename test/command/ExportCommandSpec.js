'use strict';

/**
 * Requirements
 */
const ExportCommand = require(ES_SOURCE + '/command/ExportCommand.js').ExportCommand;
const exportCommandSpec = require(ES_TEST + '/command/ExportCommandShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');

/**
 * Spec
 */
describe(ExportCommand.className, function() {
    /**
     * Command Test
     */
    function prepareParameters() {
        const fixture = projectFixture.createDynamic();
        return [fixture.context];
    }

    exportCommandSpec(ExportCommand, 'command/ExportCommand', prepareParameters, {
        action: 'default'
    });
});
