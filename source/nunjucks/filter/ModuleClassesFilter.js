'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;


/**
 * @memberOf nunjucks.filter
 */
class ModuleClassesFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor()
    {
        super();
        this._name = 'moduleClasses';
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/ModuleClassesFilter';
    }


    /**
     * @inheritDocs
     */
    filter()
    {
        return function(value, moduleClass)
        {
            if (!value || !moduleClass)
            {
                return moduleClass || '';
            }
            let result = moduleClass;
            const types = Array.isArray(value) ? value : [value];
            types.forEach(function (item, index)
            {
                if (typeof item === 'string' && item !== '')
                {
                    result += ' ' + moduleClass + '--' + item;
                }
            });
            return result;
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ModuleClassesFilter = ModuleClassesFilter;
