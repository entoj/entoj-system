'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const SystemModuleConfiguration = require('../../configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const assertParameter = require('../../utils/assert.js').assertParameter;
const pathes = require('../../utils/pathes.js');
const fs = require('fs');
const templateString = require('es6-template-strings');

/**
 * @memberOf nunjucks.filter
 */
class SvgViewBoxFilter extends Filter {
    /**
     * @inheritDocs
     */
    constructor(moduleConfiguration, pathesConfiguration) {
        super();

        // Check params
        assertParameter(
            this,
            'moduleConfiguration',
            moduleConfiguration,
            true,
            SystemModuleConfiguration
        );

        // Assign options
        this._name = 'svgViewBox';
        this._moduleConfiguration = moduleConfiguration;
    }

    /**
     * @inheritDocs
     */
    static get className() {
        return 'nunjucks.filter/SvgViewBoxFilter';
    }

    /**
     * @inheritDocs
     */
    static get injections() {
        return {
            parameters: [SystemModuleConfiguration]
        };
    }

    /**
     * @type {configuration.SystemModuleConfiguration}
     */
    get moduleConfiguration() {
        return this._moduleConfiguration;
    }

    /**
     * @inheritDoc
     */
    filter(value) {
        const scope = this;
        return function(value) {
            let result = '0 0 0 0';
            const globals = scope.getGlobals(this);
            let filename = pathes.concat(
                templateString(
                    scope.moduleConfiguration.filterSvgViewBoxBasePath,
                    globals.location || {}
                ),
                value
            );
            if (!filename.endsWith('.svg')) {
                filename += '.svg';
            }
            if (fs.existsSync(filename)) {
                const icon = fs.readFileSync(filename, { encoding: 'utf8' });
                const viewbox = icon.match(/viewBox="([^"]*)"/i);
                if (viewbox && viewbox[1]) {
                    result = viewbox[1];
                }
            } else {
                scope.logger.warn('Could not locate svg <' + filename + '>');
            }
            return scope.applyCallbacks(result, arguments, { asset: value });
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.SvgViewBoxFilter = SvgViewBoxFilter;
