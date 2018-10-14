'use strict';

/**
 * Requirements
 * @ignore
 */
const BaseMixin = require('../Base.js').BaseMixin;
const EventEmitter = require('events').EventEmitter;
const isPlainObject = require('lodash.isplainobject');
const merge = require('lodash.merge');

/**
 * @memberOf base
 * @extends {Array}
 */
class BaseMap extends BaseMixin(Map) {
    /**
     * @inheritDoc
     */
    constructor(data) {
        super();
        if (data) {
            this.load(data);
        }
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'base/BaseMap';
    }

    /**
     * @returns {EventEmitter}
     */
    get events() {
        if (!this._events) {
            this._events = new EventEmitter(this);
        }
        return this._events;
    }

    /**
     * @inheritDoc
     */
    set(...args) {
        const result = super.set(...args);
        this.events.emit('change');
        return result;
    }

    /**
     * @inheritDoc
     */
    delete(...args) {
        const result = super.delete(...args);
        this.events.emit('change');
        return result;
    }

    /**
     * @inheritDoc
     */
    clear(...args) {
        const result = super.clear(...args);
        this.events.emit('change');
        return result;
    }

    /**
     * @param {String} path
     * @param {*} defaultValue
     */
    getByPath(path, defaultValue) {
        // Path valid?
        if (!path) {
            return defaultValue;
        }

        // Walk path and find value
        const names = path.split('.');
        let current = this;
        let index = 0;
        for (const name of names) {
            // See if it is a * at the end
            if (name == '*' && index == names.length - 1) {
                return current;
            }

            // Try to get value at current name
            if (current instanceof Map) {
                current = current.get(name);
            } else if (typeof current[name] !== 'undefined') {
                current = current[name];
            } else {
                current = undefined;
            }

            // Should we stop here?
            if (typeof current === 'undefined') {
                return defaultValue;
            }

            // Inc index
            index++;
        }

        return current;
    }

    /**
     * @param {String} path
     * @param {*} value
     */
    setByPath(path, value) {
        // Path valid?
        if (!path) {
            return false;
        }

        // Walk path and find value
        const names = path.split('.');
        let parent = this;
        let current;
        for (let index = 0; index < names.length; index++) {
            const name = names[index];

            // Try to get value at current name
            current = undefined;
            if (parent instanceof Map) {
                current = parent.get(name);
            } else if (typeof parent[name] !== 'undefined') {
                current = parent[name];
            }

            // Add value if missing or last
            if (!current || index == names.length - 1) {
                current = index < names.length - 1 ? {} : value;
            }

            if (parent instanceof Map) {
                parent.set(name, current);
            } else {
                parent[name] = current;
            }
            parent = current;
        }
    }

    /**
     * @param {*} data
     * @param {bool} clear
     */
    load(data, clear) {
        if (clear === true) {
            this.clear();
        }

        if (!data) {
            return;
        }

        if (data instanceof Map || data instanceof BaseMap || typeof data.keys == 'function') {
            for (const item of data.keys()) {
                this.set(item, data.get(item));
            }
        } else if (isPlainObject(data)) {
            for (const key in data) {
                this.set(key, data[key]);
            }
        }
    }

    /**
     * @param {*} data
     */
    merge(data) {
        if (!data) {
            return;
        }

        if (data instanceof Map || data instanceof BaseMap || typeof data.keys == 'function') {
            for (const key of data.keys()) {
                const merged = merge(this.getByPath(key, {}), data.get(key));
                this.set(key, merged);
            }
        } else if (isPlainObject(data)) {
            for (const key in data) {
                const merged = merge(this.getByPath(key, {}), data[key]);
                this.set(key, merged);
            }
        }
    }

    /**
     * Returns a simple string representation of the object
     *
     * @returns {string}
     */
    toString() {
        return `[${this.className} size=${this.size}]`;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.BaseMap = BaseMap;
