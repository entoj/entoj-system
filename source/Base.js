'use strict';

/**
 * Requirements
 * @ignore
 */
const intel = require('intel');
require('./utils/prototypes.js');

/**
 * Instance Id counter
 * @type {Number}
 */
let instanceId = 1;

/**
 * Setup intel
 */
intel.config({
    formatters: {
        console: {
            datefmt: '%H:%M:%S:%L',
            format: '[%(date)s] %(levelname)s %(name)s - %(message)s',
            colorize: true
        }
    },
    handlers: {
        console: {
            class: intel.handlers.Console,
            formatter: 'console'
        }
    },
    loggers: {
        entoj: {
            handlers: ['console'],
            level: intel.WARN
        }
    }
});

/**
 * Base mixin providing some common helpers.
 *
 * @mixin
 */
const BaseMixin = (target) =>
    class extends target {
        /**
         * Injection meta for DIContainer
         *
         * @alias BaseMixin.injections
         * @type {Object}
         * @static
         * @memberOf BaseMixin
         */
        static get injections() {
            return {};
        }

        /**
         * The namespaced class name
         *
         * @alias BaseMixin#className
         * @type {String}
         * @memberOf BaseMixin
         */
        get className() {
            return this.constructor.className;
        }

        /**
         * Global unique instance id
         *
         * @name instanceId
         * @type {Number}
         * @memberOf BaseMixin
         */
        get instanceId() {
            if (!this._instanceId) {
                this._instanceId = instanceId++;
            }
            return this._instanceId;
        }

        /**
         * The base debug logger
         *
         * @name logger
         * @type {intel.logger}
         * @memberOf BaseMixin
         */
        get logger() {
            return intel.getLogger('entoj.' + this.className);
        }

        /**
         * Returns a simple string representation of the object
         *
         * @name toString
         * @method
         * @returns {String}
         * @memberOf BaseMixin
         */
        toString() {
            return `[${this.className}#${this.instanceId}]`;
        }
    };

/**
 * Base class providing some common helpers.
 *
 * @mixes BaseMixin
 */
class Base extends BaseMixin(Object) {
    /**
     * The namespaced class name
     *
     * @name className
     * @type {String}
     * @static
     * @memberOf BaseMixin
     */
    static get className() {
        return 'Base';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.BaseMixin = BaseMixin;
module.exports.Base = Base;
