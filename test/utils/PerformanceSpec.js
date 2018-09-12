'use strict';

/**
 * Requirements
 */
const PerformanceMetrics = require(ES_SOURCE + '/utils/performance.js').PerformanceMetrics;
const PerformanceMetricScope = require(ES_SOURCE + '/utils/performance.js').PerformanceMetricScope;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * PerformanceMetrics
 */
describe(PerformanceMetricScope.className, function() {
    baseSpec(PerformanceMetricScope, 'utils/PerformanceMetricScope');

    it('should allow to measure the time for a named action', function() {
        const testee = new PerformanceMetricScope();
        testee.start('test');
        testee.stop('test');
        expect(testee.items['test']).to.be.ok;
    });

    describe('#name', function() {
        it('should have a name', function() {
            const testee = new PerformanceMetricScope();
            expect(testee.name).to.be.equal('root');
        });
    });

    describe('#clear', function() {
        it('should allow to clear all current timers', function() {
            const testee = new PerformanceMetricScope();
            testee.start('test');
            testee.stop('test');
            testee.clear();
            expect(testee.items['test']).to.be.not.ok;
        });
    });

    describe('#show', function() {
        it('should allow print results to the console', function() {
            const testee = new PerformanceMetricScope();
            testee.start('test');
            testee.stop('test');
            testee.show();
            testee.show(['test']);
        });
    });

    describe('#save', function() {
        it('should allow save results to a file', function() {
            const testee = new PerformanceMetricScope();
            testee.start('test');
            testee.stop('test');
            testee.save(ES_FIXTURES + '/temp/performance-scope.json');
        });
    });
});

/**
 * PerformanceMetrics
 */
describe(PerformanceMetrics.className, function() {
    baseSpec(PerformanceMetrics, 'utils/PerformanceMetrics');

    it('should allow to measure the time for a named action', function() {
        const testee = new PerformanceMetrics();
        testee.enable();
        testee.start('test');
        testee.stop('test');
        expect(testee.current.items['test']).to.be.ok;
    });

    it('should allow to scope measurement', function() {
        const testee = new PerformanceMetrics();
        testee.enable();
        testee.start('test');
        testee.stop('test');
        expect(testee.current.items['test']).to.be.ok;
        expect(testee.current.items['test'].count).to.be.equal(1);

        testee.pushScope();
        testee.start('test');
        testee.stop('test');
        expect(testee.current.items['test']).to.be.ok;
        expect(testee.current.items['test'].count).to.be.equal(1);
        testee.popScope();

        expect(testee.current.items['test']).to.be.ok;
        expect(testee.current.items['test'].count).to.be.equal(2);
    });

    describe('#show', function() {
        it('should allow print results to the console', function() {
            const testee = new PerformanceMetrics();
            testee.start('test');
            testee.stop('test');
            testee.show();
            testee.show(['test']);
        });
    });

    describe('#save', function() {
        it('should allow save results to a file', function() {
            const testee = new PerformanceMetrics();
            testee.start('test');
            testee.stop('test');
            testee.save(ES_FIXTURES + '/temp/performance-metrics.json');
        });
    });
});
