'use strict';

/**
 * Requirements
 * @ignore
 */
const fs = require('fs');
const path = require('path');
const BaseMixin = require('../../Base.js').BaseMixin;
const Loader = require('nunjucks').Loader;
const Template = require('../Template.js').Template;
const assertParameter = require('../../utils/assert.js').assertParameter;
const PATH_SEPERATOR = require('path').sep;

/**
 * Tries to guess template files when no full path is given
 *
 * @class
 * @memberOf nunjucks.loader
 */
class FileLoader extends BaseMixin(Loader) {
    /**
     * @inheritDoc
     */
    constructor(searchPaths, template, nunjucks) {
        super();

        // Check params
        assertParameter(this, 'template', template, true, Template);

        // Assign
        this.noCache = true;
        this.cache = {};
        this.pathsToNames = {};
        this._template = template;
        this._nunjucks = nunjucks;

        // Set pathes
        this.setSearchPaths(searchPaths || '.');
    }

    /**
     * The namespaced class name
     *
     * @type {string}
     * @static
     */
    static get className() {
        return 'nunjucks.loader/FileLoader';
    }

    /**
     * The template preparation
     *
     * @type {string}
     * @static
     */
    get template() {
        return this._template;
    }

    /**
     * Nunjucks environment
     *
     * @type {Nunjucks}
     * @static
     */
    get nunjucks() {
        return this._nunjucks;
    }

    /**
     * Updates search pathes
     *
     * @param {String} value
     */
    setSearchPaths(value) {
        const searchPaths = Array.isArray(value) ? value : [value];
        this.searchPaths = searchPaths.map((pth) => {
            return path.resolve(pth);
        });
    }

    /**
     * Resolves a template file
     *
     * @protected
     * @param {String} filename
     * @retuns {String|Boolean}
     */
    resolveFile(filename) {
        let result = false;

        //Direct file?
        this.searchPaths.forEach(function(pth) {
            try {
                const file = path.join(pth, filename);
                const stat = fs.statSync(file);
                if (stat.isFile()) {
                    result = file;
                }
            } catch (e) {
                // No file
            }
        });

        return result;
    }

    /**
     * @inheritDoc
     * @see https://mozilla.github.io/nunjucks/api.html#loader
     */
    resolve(filename) {
        const file = path.normalize(filename);
        let result = this.resolveFile(file);

        //Check for simple shortcut to entity like /base/elements/e-cta
        if (!result) {
            const parts = file.split(PATH_SEPERATOR);
            const aliased = path.join(file, parts.pop() + '.j2');
            result = this.resolveFile(aliased);
        }

        return result;
    }

    /**
     * @inheritDoc
     * @see https://mozilla.github.io/nunjucks/api.html#loader
     */
    getSource(name) {
        // Get filepath
        const fullPath = this.resolve(name);
        if (!fullPath) {
            this.logger.warn('Could not resolve ' + name + ' on pathes ', this.searchPaths);
            return null;
        }

        // Fetch template
        const template = {
            src: fs.readFileSync(fullPath, { encoding: 'utf-8' }),
            path: fullPath,
            noCache: this.noCache
        };

        // Prepare the source
        const location = this.nunjucks ? this.nunjucks.globals['location'] : {};
        template.src = this.template.prepare(template.src, location);

        return template;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.FileLoader = FileLoader;
