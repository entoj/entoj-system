'use strict';

/**
 * Requirements
 * @ignore
 */
const BaseMixin = require('../Base.js').BaseMixin;
const isPlainObject = require('lodash.isplainobject');
const merge = require('lodash.merge');


/**
 * @memberOf base
 * @extends {Array}
 */
class BaseMap extends BaseMixin(Map)
{
    /**
     * @inheritDocs
     */
    constructor(data)
    {
        super();
        if (data)
        {
            this.load(data);
        }
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'base/BaseMap';
    }


    /**
     * @param {String} path
     * @param {*} defaultValue
     */
    getByPath(path, defaultValue)
    {
        // Path valid?
        if (!path)
        {
            return defaultValue;
        }

        // Walk path and find value
        const names = path.split('.');
        let current = this;
        for (const name of names)
        {
            // Try to get value at current name
            if (current instanceof Map)
            {
                current = current.get(name);
            }
            else if (typeof current[name] !== 'undefined')
            {
                current = current[name];
            }
            else
            {
                current = undefined;
            }

            // Should we stop here?
            if (typeof current === 'undefined')
            {
                return defaultValue;
            }
        }

        return current;
    }


    /**
     * @param {*} data
     * @param {bool} clear
     */
    load(data, clear)
    {
        if (clear === true)
        {
            this.clear();
        }

        if (!data)
        {
            return;
        }

        if (data instanceof Map || data instanceof BaseMap || typeof data.keys == 'function')
        {
            for (const item of data.keys())
            {
                this.set(item, data.get(item));
            }
        }
        else if (isPlainObject(data))
        {
            for (const key in data)
            {
                this.set(key, data[key]);
            }
        }
    }


    /**
     * @param {*} data
     */
    merge(data)
    {
        if (!data)
        {
            return;
        }

        if (data instanceof Map || data instanceof BaseMap || typeof data.keys == 'function')
        {
            for (const key of data.keys())
            {
                const merged = merge(this.getByPath(key, {}), data.get(key));
                this.set(key, merged);
            }
        }
        else if (isPlainObject(data))
        {
            for (const key in data)
            {
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
    toString()
    {
        return `[${this.className} size=${this.size}]`;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.BaseMap = BaseMap;
