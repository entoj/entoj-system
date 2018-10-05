'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const DIContainer = require('../utils/DIContainer.js').DIContainer;
const assertParameter = require('../utils/assert.js').assertParameter;
const metrics = require('../utils/performance.js').metrics;

/**
 * Context is the backbone of the application.
 * It parses the given configuration and sets up appropriate dependency
 * injection bindings.
 *
 * @memberOf application
 * @extends Base
 */
class Context extends Base {
    /**
     * @param {application.Bootstrap} bootstrap
     */
    constructor(diContainer, configuration) {
        super();

        //Check params
        assertParameter(this, 'diContainer', diContainer, true, DIContainer);

        // Prepare
        this._di = diContainer;
        this._configuration = configuration;
        this._parameters = configuration.system.arguments || {};

        // Configure
        this._di.map(Context, this);
        this.configure();
        Context._instance = this;
    }

    /**
     * @inheritDoc
     */
    static get instance() {
        if (!Context._instance) {
            throw new Error(Context.className + ': No Context configured');
        }
        return Context._instance;
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'application/Context';
    }

    /**
     * @type {Object}
     */
    get parameters() {
        return this._parameters;
    }

    /**
     * @type {Object}
     */
    get configuration() {
        return this._configuration;
    }

    /**
     * @type {DIContainer}
     */
    get di() {
        return this._di;
    }

    /**
     * @protected
     */
    configure() {
        const intel = require('intel');
        const logger = intel.getLogger('entoj');

        if (this.parameters.performance) {
            metrics.enable();
        }

        if (this.parameters.v) {
            logger.setLevel(intel.WARN);
        }
        if (this.parameters.vv) {
            logger.setLevel(intel.INFO);
        }
        if (this.parameters.vvv) {
            logger.setLevel(intel.DEBUG);
        }
        if (this.parameters.vvvv) {
            logger.setLevel(intel.TRACE);
        }
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.Context = Context;
