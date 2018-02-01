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
const deasync = require('deasync');
const request = deasync(require('request'));


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

            // See if it's a url
            if (value.startsWith('http'))
            {
                const response = request(value, { strictSSL: false });
                let data = {};
                if (response.body)
                {
                    try
                    {
                        data = JSON.parse(response.body);
                    }
                    catch (e)
                    {
                        scope.logger.warn('Failed loading model from ' + value);
                    }
                }
                return data;
            }

            // Load internal models
            const globals = (this && this.env && this.env.globals)
                ? this.env.globals
                : { location: {} };
            const site = globals.location
                ? globals.location.site || false
                : false;
            const useStaticContent = scope.useStaticContent(globals.request);
            const viewModel = synchronize.execute(scope.viewModelRepository, 'getByPath', [value, site, useStaticContent]);
            return viewModel.data;
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.LoadFilter = LoadFilter;
