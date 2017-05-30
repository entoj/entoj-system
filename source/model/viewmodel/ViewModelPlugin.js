'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;


/**
 * @class
 * @memberOf model.viewmodel
 * @extends {Base}
 */
class ViewModelPlugin extends Base
{
    /**
     * @inheritDocs
     */
    constructor()
    {
        super();

        // Assign
        this._name = [];
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model.viewmodel/ViewModelPlugin';
    }


    /**
     * @type {Array}
     */
    get name()
    {
        return this._name;
    }

    set name(value)
    {
        this._name = Array.isArray(value) ? value : [value];
    }


    /**
     * @protected
     * @param {model.viewmodel.ViewModelRepository} repository
     * @param {model.site.Site} site
     * @param {Boolean} useStaticContent - Should we use static or random contents?
     * @param {Object} parameters
     * @returns {Promise}
     */
    doExecute(repository, site, useStaticContent, name, parameters)
    {
        return Promise.resolve();
    }


    /**
     * @param {model.viewmodel.ViewModelRepository} repository
     * @param {model.site.Site} site
     * @param {Boolean} useStaticContent - Should we use static or random contents?
     * @param {Object} parameters
     * @returns {Promise}
     */
    execute(repository, site, useStaticContent, name, parameters)
    {
        if (this.name.length && this.name.indexOf(name) === -1)
        {
            return Promise.resolve();
        }
        return this.doExecute(repository, site, useStaticContent, name, parameters);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ViewModelPlugin = ViewModelPlugin;
