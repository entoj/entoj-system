'use strict';

/**
 * Requirements
 * @ignore
 */
const BaseMixin = require('../Base.js').BaseMixin;
const isPlainObject = require('lodash.isplainobject');
const EventEmitter = require('events').EventEmitter;


/**
 * @memberOf base
 * @extends {Array}
 */
class BaseArray extends BaseMixin(Array)
{
    /**
     * The namespaced class name
     *
     * @type {string}
     * @static
     */
    static get className()
    {
        return 'base/BaseArray';
    }


    /**
     * @returns {EventEmitter}
     */
    get events()
    {
        if (!this._events)
        {
            this._events = new EventEmitter(this);
        }
        return this._events;
    }


    /**
     * @inheritDocs
     */
    pop()
    {
        const result = super.pop();
        this.events.emit('change');
        return result;
    }


    /**
     * @inheritDocs
     */
    push(...items)
    {
        const result = super.push(...items);
        this.events.emit('change');
        return result;
    }


    /**
     * @inheritDocs
     */
    reverse()
    {
        const result = super.reverse();
        this.events.emit('change');
        return result;
    }


    /**
     * @inheritDocs
     */
    shift()
    {
        const result = super.shift();
        this.events.emit('change');
        return result;
    }


    /**
     * @inheritDocs
     */
    sort(compareFunction)
    {
        const result = super.sort(compareFunction);
        this.events.emit('change');
        return result;
    }


    /**
     * @inheritDocs
     */
    splice(...items)
    {
        const result = super.splice(...items);
        this.events.emit('change');
        return result;
    }


    /**
     * @inheritDocs
     */
    slice(begin, end)
    {
        const result = super.slice(begin, end);
        this.events.emit('change');
        return result;
    }


    /**
     * @returns {void}
     */
    clear()
    {
        this.length = 0;
        this.events.emit('change');
    }


    /**
     * @param {*} item
     * @returns {Boolean}
     */
    remove(item)
    {
        const index = this.indexOf(item);
        if (index !== -1)
        {
            this.splice(index, 1);
        }
        return (index !== -1);
    }


    /**
     * @param {*} reference
     * @param {*} item
     * @returns {Boolean}
     */
    replace(reference, item)
    {
        const index = this.indexOf(reference);
        if (index !== -1)
        {
            this.insertBefore(reference, item);
            this.remove(reference);
            return true;
        }
        return false;
    }


    /**
     * @param {*} reference
     * @param {*} item
     * @returns {Boolean}
     */
    insertBefore(reference, item)
    {
        const index = this.indexOf(reference);
        if (index !== -1)
        {
            this.splice(index, 0, item);
        }
        return (index !== -1);
    }


    /**
     * @param {*} reference
     * @param {*} item
     * @returns {Boolean}
     */
    insertAfter(reference, item)
    {
        const index = this.indexOf(reference);
        if (index !== -1)
        {
            this.splice(index + 1, 0, item);
        }
        return (index !== -1);
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

        if (data instanceof Array)
        {
            for (const item of data)
            {
                this.push(item);
            }
        }
        else if (isPlainObject(data))
        {
            for (const key in data)
            {
                this.push(data[key]);
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
        return `[${this.className} length=${this.length}]`;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.BaseArray = BaseArray;
