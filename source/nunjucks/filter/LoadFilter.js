'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const ViewModelRepository = require('../../model/viewmodel/ViewModelRepository.js').ViewModelRepository;
const assertParameter = require('../../utils/assert.js').assertParameter;
const synchronize = require('../../utils/synchronize.js');
const isString = require('lodash.isstring');


/**
 * A filter that is used to load static json models from
 * entities when given a path like e-cta/modelName.
 *
 * @memberOf nunjucks.filter
 */
class LoadFilter extends Filter
{
    /**
     * @param {model.viewmodel.ViewModelRepository} viewModelRepository
     * @param {Object} options
     */
    constructor(viewModelRepository)
    {
        super();
        this._name = 'load';

        // Check params
        assertParameter(this, 'viewModelRepository', viewModelRepository, true, ViewModelRepository);

        // Assign options
        this._viewModelRepository = viewModelRepository;
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [ViewModelRepository] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'nunjucks.filter/LoadFilter';
    }


    /**
     * @type {model.viewmodel.ViewModelRepository}
     */
    get viewModelRepository()
    {
        return this._viewModelRepository;
    }


    /**
     * @inheritDocs
     */
    filter()
    {
        const scope = this;
        return function (value)
        {
            if (!isString(value))
            {
                return value;
            }
            const globals = (this && this.env && this.env.globals) ? this.env.globals : {};
            const site = globals.site || false;
            const staticMode = (globals.request) ? (typeof globals.request.query.static !== 'undefined') : false;
            const viewModel = synchronize.execute(scope.viewModelRepository, 'getByPath', [value, site, staticMode]);
            return viewModel.data;
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.LoadFilter = LoadFilter;
