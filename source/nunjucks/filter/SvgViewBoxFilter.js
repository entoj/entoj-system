'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const PathesConfiguration = require('../../model/configuration/PathesConfiguration.js').PathesConfiguration;
const assertParameter = require('../../utils/assert.js').assertParameter;
const pathes = require('../../utils/pathes.js');
const fs = require('fs');
const templateString = require('es6-template-strings');


/**
 * @memberOf nunjucks.filter
 */
class SvgViewBoxFilter extends Filter
{
    /**
     * @inheritDocs
     */
    constructor(pathesConfiguration, basePath)
    {
        super();
        this._name = 'svgViewBox';

        // Check params
        assertParameter(this, 'pathesConfiguration', pathesConfiguration, true, PathesConfiguration);

        // Assign options
        this._basePath = basePath || '/';
        this._pathesConfiguration = pathesConfiguration;
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'nunjucks.filter/SvgViewBoxFilter';
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [PathesConfiguration, 'nunjucks.filter/SvgViewBoxFilter.basePath'] };
    }


    /**
     * @type {String}
     */
    get basePath()
    {
        return this._basePath;
    }

    /**
     * @returns {String}
     */
    getBasePath(globals)
    {
        let result = this._basePath;
        if (this.environment &&
            this.environment.buildConfiguration)
        {
            result = this.environment.buildConfiguration.get('filters.svgPath', this._basePath);
        }
        return templateString(result, globals.location || {});
    }


    /**
     * @type {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration()
    {
        return this._pathesConfiguration;
    }


    /**
     * @inheritDocs
     */
    filter(value)
    {
        const scope = this;
        return function(value)
        {
            let result = '0 0 0 0';
            const globals = scope.getGlobals(this);
            const filename = pathes.concat(scope.pathesConfiguration.sites, scope.getBasePath(globals), value + '.svg');
            if (fs.existsSync(filename))
            {
                const icon = fs.readFileSync(filename, { encoding: 'utf8' });
                const viewbox = icon.match(/viewBox="([^"]*)"/i);
                if (viewbox && viewbox[1])
                {
                    result = viewbox[1];
                }
            }
            else
            {
                scope.logger.warn('Could not locate svg <' + filename + '>');
            }
            return scope.applyCallbacks(result, arguments);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.SvgViewBoxFilter = SvgViewBoxFilter;
