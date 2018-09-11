'use strict';

/**
 * Requirements
 * @ignore
 */
const commandSpec = require(ES_TEST + '/command/CommandShared.js').spec;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Shared ExportCommand spec
 */
function spec(type, className, prepareParameters, options) {
    /**
     * Command Test
     */
    const opts = options || {};
    commandSpec(type, className, prepareParameters, { action: opts.action });

    /**
     * ExportCommand Test
     */

    // create a testee instance
    function createTestee() {
        let params = [];
        if (prepareParameters) {
            params = prepareParameters(params);
        }
        return new type(...params);
    }

    // Simple properties
    baseSpec.assertProperty(createTestee(), [
        'exportTaskClass',
        'moduleConfigurationClass',
        'exportName',
        'loggerPrefix'
    ]);

    describe('#addTaskOptions', function() {
        it('should return a promise', function() {
            const testee = createTestee();
            const result = testee.addTaskOptions();
            expect(result).to.be.instanceof(Promise);
            return result;
        });
    });

    describe('#addTasks', function() {
        it('should return a promise', function() {
            const testee = createTestee();
            const result = testee.addTasks();
            expect(result).to.be.instanceof(Promise);
            return result;
        });
    });

    xdescribe('#execute', function() {});
}

/**
 * Exports
 */
module.exports.spec = spec;
