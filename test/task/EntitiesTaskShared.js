'use strict';

/**
 * Requirements
 */
const taskSpec = require(ES_TEST + '/task/TaskShared.js').spec;
const sinon = require('sinon');
const co = require('co');

/**
 * Shared EntitiesTask spec
 */
function spec(type, className, prepareParameters, options) {
    /**
     * Task Test
     */
    taskSpec(type, className, prepareParameters, options);
    spec.readStream = taskSpec.readStream;
    spec.filesStream = taskSpec.filesStream;

    /**
     * EntitiesTask Test
     */
    const createTestee = function() {
        let parameters = Array.from(arguments);
        if (prepareParameters) {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    describe('#stream()', function() {
        it('should call processEntities', function() {
            const promise = co(function*() {
                const testee = createTestee();
                sinon.spy(testee, 'processEntities');
                yield taskSpec.readStream(testee.stream());
                expect(testee.processEntities.calledOnce).to.be.ok;
            });
            return promise;
        });

        it('should call processEntity for each entity queried', function() {
            const promise = co(function*() {
                const testee = createTestee();
                sinon.spy(testee, 'processEntity');
                yield taskSpec.readStream(testee.stream());
                expect(testee.processEntity.callCount).to.be.above(8); // 9 Entities per Site
            });
            return promise;
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
