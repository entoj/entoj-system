'use strict';

/**
 * Requirements
 * @ignore
 */
const fs = require('fs');
const path = require('path');
const BaseMixin = require('../../Base.js').BaseMixin;
const Loader = require('nunjucks').Loader;
const EntitiesRepository = require('../../model/entity/EntitiesRepository.js').EntitiesRepository;
const BuildConfiguration = require('../../model/configuration/BuildConfiguration.js').BuildConfiguration;
const Template = require('../Template.js').Template;
const assertParameter = require('../../utils/assert.js').assertParameter;
const PATH_SEPERATOR = require('path').sep;


/**
 * Tries to guess template files when no full path is given
 *
 * @class
 * @memberOf nunjucks.loader
 */
class FileLoader extends BaseMixin(Loader)
{
    /**
     * @inheritDocs
     */
    constructor(searchPaths, entitiesRepository, buildConfiguration)
    {
        super();

        // Check params
        assertParameter(this, 'entitiesRepository', entitiesRepository, true, EntitiesRepository);
        assertParameter(this, 'buildConfiguration', buildConfiguration, true, BuildConfiguration);

        // Assign
        this.noCache = true;
        this.cache = {};
        this.pathsToNames = {};
        this._entitiesRepository = entitiesRepository;
        this._buildConfiguration = buildConfiguration;
        this._template = new Template(this._entitiesRepository, undefined, this._buildConfiguration.environment);

        // Set pathes
        this.setSearchPaths(searchPaths || '.');
    }


    /**
     * The namespaced class name
     *
     * @type {string}
     * @static
     */
    static get className()
    {
        return 'nunjucks.loader/FileLoader';
    }


    /**
     * Updates search pathes
     *
     * @param {String} value
     */
    setSearchPaths(value)
    {
        const searchPaths = Array.isArray(value) ? value : [value];
        this.searchPaths = searchPaths.map((pth) =>
        {
            return path.resolve(pth);
        });
        this._template.basePath = this.searchPaths[0];
    }


    /**
     * Resolves a template file
     *
     * @protected
     * @param {String} filename
     * @retuns {String|Boolean}
     */
    resolveFile(filename)
    {
        let result = false;

        //Direct file?
        this.searchPaths.forEach(function(pth)
        {
            try
            {
                const file = path.join(pth, filename);
                const stat = fs.statSync(file);
                if (stat.isFile())
                {
                    result = file;
                }
            }
            catch (e)
            {
                // No file
            }
        });

        return result;
    }


    /**
     * @inheritDocs
     * @see https://mozilla.github.io/nunjucks/api.html#loader
     */
    resolve(filename)
    {
        const file = path.normalize(filename);
        let result = this.resolveFile(file);

        //Check for simple shortcut to entity like /base/elements/e-cta
        if (!result)
        {
            const parts = file.split(PATH_SEPERATOR);
            const aliased = path.join(file, parts.pop() + '.j2');
            result = this.resolveFile(aliased);
        }

        return result;
    }


    /**
     * @inheritDocs
     * @see https://mozilla.github.io/nunjucks/api.html#loader
     */
    getSource(name)
    {
        // Get filepath
        const fullPath = this.resolve(name);
        if (!fullPath)
        {
            this.logger.warn('Could not resolve ' + name + ' on path ' + fullPath);
            return null;
        }

        // Fetch template
        const template =
        {
            src: fs.readFileSync(fullPath, { encoding: 'utf-8' }),
            path: fullPath,
            noCache: this.noCache
        };

        // Prepare the source
        template.src = this._template.prepare(template.src);

        return template;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.FileLoader = FileLoader;
