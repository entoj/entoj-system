'use strict';

/**
 * Requirements
 */
const Route = require(ES_SOURCE + '/server/route/Route.js').Route;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const routeSpec = require('./RouteShared.js').spec;

/**
 * Spec
 */
describe(Route.className, function() {
    /**
     * Route Test
     */
    routeSpec(Route, 'server.route/Route', function(parameters) {
        const cliLogger = new CliLogger('', { muted: true });
        return [cliLogger];
    });
});
