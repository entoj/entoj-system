'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const BaseArray = require('../base/BaseArray.js').BaseArray;
const BaseMap = require('../base/BaseMap.js').BaseMap;


/**
 * @class
 * @memberOf model
 * @extends {Base}
 */
class ValueObject extends Base
{
    /**
     * @param {Object} values
     */
    constructor(values)
    {
        super();

        // Add initial values
        this.initialize();
        this.dehydrate(values);
    }

    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model/ValueObject';
    }


    /**
     * @property {*}
     */
    get uniqueId()
    {
        return this;
    }


    /**
     * Returns a object of all fields with their
     * default values. Th elist is used to de/hydrate
     * the value object.
     *
     * @property {Object}
     */
    get fields()
    {
        return {};
    }


    /**
     * Called right after instanciation.
     * Use this tmeplate method to setup properties.
     *
     * @returns {void}
     */
    initialize()
    {
    }


    /**
     * @param {ValueObject} other
     * @returns {Bool}
     */
    isEqualTo(other)
    {
        return other && (this.uniqueId === other.uniqueId);
    }


    /**
     * @param {*} values
     * @returns {void}
     */
    dehydrate(values)
    {
        const v = values || {};
        for (const name in this.fields)
        {
            const selfValue = this[name];
            const defaultValue = this.fields[name];
            const importValue = v[name];

            // Create field?
            if (typeof selfValue === 'undefined')
            {
                try
                {
                    if (typeof defaultValue === 'function')
                    {
                        this[name] = new defaultValue();
                        // Prefill VO
                        if (this[name] instanceof ValueObject)
                        {
                            this[name].dehydrate({});
                        }
                    }
                    else
                    {
                        this[name] = defaultValue;
                    }
                }
                catch(e)
                {
                    /* istanbul ignore next */
                    this.warn('FAIL: Creating field', name, this.className, e);
                }
            }

            // Import?
            if (typeof importValue !== 'undefined')
            {
                // is BaseArray or BaseMap?
                if (this[name] instanceof BaseArray || this[name] instanceof BaseMap)
                {
                    this[name].load(importValue, true);
                }
                else if (this[name] instanceof ValueObject)
                {
                    this[name].dehydrate(importValue);
                }
                else
                {
                    try
                    {
                        this[name] = importValue;
                    }
                    catch(e)
                    {
                        /* istanbul ignore next */
                        this.warn('FAIL: Importing default for', name, this.className, e);
                    }
                }
            }
        }
    }


    /**
     * @returns {Object}
     */
    hydrate()
    {
        const result = {};
        for (const name in this.fields)
        {
            if (this[name] instanceof ValueObject)
            {
                result[name] = this[name].hydrate();
            }
            else if (Array.isArray(this[name]))
            {
                result[name] = [];
                for (const item of this[name])
                {
                    if (item instanceof ValueObject)
                    {
                        result[name].push(item.hydrate());
                    }
                    else
                    {
                        result[name].push(item);
                    }
                }
            }
            else if (this[name] instanceof BaseMap)
            {
                result[name] = {};
                for (const key in this[name])
                {
                    const item = this[name][key];
                    if (item instanceof ValueObject)
                    {
                        result[name][key] = item.hydrate();
                    }
                    else
                    {
                        result[name][key] = item;
                    }
                }
            }
            else
            {
                result[name] = this[name];
            }
        }
        return result;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ValueObject = ValueObject;
