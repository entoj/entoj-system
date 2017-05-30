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
     * @inheritDocs
     */
    constructor()
    {
        super();
        this.name = ['import', 'include'];
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model.viewmodel.plugin/ViewModelImportPlugin';
    }


    /**
     * @inheritDocs
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
