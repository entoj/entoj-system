'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;


/**
 * @class
 * @memberOf entity
 * @extends {Base}
 */
class Loader extends Base
{
    /**
     * @ignore
     */
    constructor(items)
    {
        super();
        this._items = items || [];
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': ['model/Loader.items'] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model/Loader';
    }


    /**
     * Loads & parses data and resolve it as an array
     *
     * @param {*} [changes]
     * @returns {Promise.<Array>}
     */
    load(changes)
    {
        return Promise.resolve(this._items);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.Loader = Loader;
