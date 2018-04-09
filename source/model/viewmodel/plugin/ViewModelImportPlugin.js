'use strict';

/**
 * Requirements
 * @ignore
 */
const ViewModelPlugin = require('../ViewModelPlugin.js').ViewModelPlugin;


/**
 * @class
 * @memberOf model.viewmodel.plugin
 * @extends {Base}
 */
class ViewModelImportPlugin extends ViewModelPlugin
{
    /**
     * @inheritDoc
     */
    constructor()
    {
        super();
        this._name = ['import', 'include'];
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.viewmodel.plugin/ViewModelImportPlugin';
    }


    /**
     * @inheritDoc
     */
    doExecute(repository, site, useStaticContent, name, parameters)
    {
        return repository.load(parameters, site, useStaticContent);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ViewModelImportPlugin = ViewModelImportPlugin;
