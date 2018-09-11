'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;
const BaseMap = require('../../base/BaseMap.js').BaseMap;

/**
 * Holds all global configurations.
 *
 * @memberOf model.configuration
 */
class GlobalConfiguration extends Base {
    /**
     * @param {object} options
     */
    constructor(options) {
        super();

        // Settings
        this._values = new BaseMap();
        this._values.load(this.defaults);
        this._values.load(options);
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: ['model.configuration/GlobalConfiguration.options'] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'model.configuration/GlobalConfiguration';
    }

    /**
     * @inheritDoc
     */
    get defaults() {
        const result = {
            groups: {
                default: 'common'
            },
            formats: {
                date: 'YYYY-MM-DD',
                number: '0.000'
            },
            tests: []
        };
        return result;
    }

    /**
     * @inheritDoc
     */
    has(name) {
        return this._values.getByPath(name) !== undefined;
    }

    /**
     * @inheritDoc
     */
    get(name, defaultValue) {
        const result = this._values.getByPath(name, defaultValue);
        if (typeof result === 'undefined') {
            throw new Error('Could not find settings for ' + name);
        }
        return result;
    }

    /**
     * @inheritDoc
     */
    set(name, value) {
        this._values.setByPath(name, value);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.GlobalConfiguration = GlobalConfiguration;
