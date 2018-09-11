'use strict';

/**
 * Requirements
 */
const DecorateTask = require(ES_SOURCE + '/task/DecorateTask.js').DecorateTask;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const transformingTaskSpec = require(ES_TEST + '/task/TransformingTaskShared.js').spec;
const VinylFile = require('vinyl');
const co = require('co');

/**
 * Spec
 */
describe(DecorateTask.className, function() {
    /**
     * TransformingTask Test
     */
    transformingTaskSpec(DecorateTask, 'task/DecorateTask', prepareParameters);

    /**
     */
    function prepareParameters(parameters) {
        parameters.unshift(global.fixtures.cliLogger);
        return parameters;
    }

    /**
     * DecorateTask Test
     */
    beforeEach(function() {
        global.fixtures.cliLogger = new CliLogger();
        global.fixtures.cliLogger.muted = true;
    });

    describe('#processFile()', function() {
        it('should decorate file contents with the configured templates', function() {
            const promise = co(function*() {
                const options = {
                    decoratePrepend: 'Prepend ${version}\n',
                    decorateAppend: '\nAppend ${version}',
                    decorateVariables: {
                        version: '1.0.1'
                    }
                };
                const fileData = 'CONTENT';
                const file = new VinylFile({
                    path: '/tmp/template.css',
                    contents: new Buffer(fileData)
                });
                const testee = new DecorateTask(global.fixtures.cliLogger);
                const data = yield testee.processFile(file, undefined, options);
                expect(data).to.be.instanceof(VinylFile);
                expect(data.contents.toString()).to.be.equal(
                    'Prepend 1.0.1\nCONTENT\nAppend 1.0.1'
                );
            });
            return promise;
        });

        it('should allow to skip decorating file types', function() {
            const promise = co(function*() {
                const options = {
                    decorateSkipFiles: ['.css'],
                    decoratePrepend: 'Prepend ${version}\n',
                    decorateAppend: '\nAppend ${version}',
                    decorateVariables: {
                        version: '1.0.1'
                    }
                };
                const fileData = '<$ data $>';
                const file = new VinylFile({
                    path: '/tmp/template.css',
                    contents: new Buffer(fileData)
                });
                const testee = new DecorateTask(global.fixtures.cliLogger);
                const data = yield testee.processFile(file, undefined, options);
                expect(data).to.be.instanceof(VinylFile);
                expect(data.contents.toString()).to.be.equal(fileData);
            });
            return promise;
        });

        it('should allow to disable decorating files', function() {
            const promise = co(function*() {
                const options = {
                    decoratePrepend: 'Prepend\n',
                    decorateEnabled: false
                };
                const fileData = '<$ data $>';
                const file = new VinylFile({
                    path: '/tmp/template.css',
                    contents: new Buffer(fileData)
                });
                const testee = new DecorateTask(global.fixtures.cliLogger);
                const data = yield testee.processFile(file, undefined, options);
                expect(data).to.be.instanceof(VinylFile);
                expect(data.contents.toString()).to.be.equal(fileData);
            });
            return promise;
        });
    });
});
