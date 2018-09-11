'use strict';

/**
 * Requirements
 */
const FileLinter = require(ES_SOURCE + '/linter/FileLinter.js').FileLinter;
const fileLinterSpec = require('./FileLinterShared.js').spec;

/**
 * Spec
 */
describe(FileLinter.className, function() {
    /**
     * FileLinter Fixture
     */
    const fixture = {
        root: ES_FIXTURES + PATH_SEPERATOR + 'files',
        glob: ['/mixed/*.js', '/js/*.js'],
        globCount: 2
    };

    /**
     * BaseLinter Test
     */
    fileLinterSpec(FileLinter, 'linter/FileLinter', fixture);
});
