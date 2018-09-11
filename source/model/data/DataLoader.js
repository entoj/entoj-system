'use strict';

/**
 * Requirements
 * @ignore
 */
const Loader = require('../Loader.js').Loader;
const PathesConfiguration = require('../configuration/PathesConfiguration.js').PathesConfiguration;
const SitesRepository = require('../site/SitesRepository.js').SitesRepository;
const Data = require('./Data.js').Data;
const ErrorHandler = require('../../error/ErrorHandler.js').ErrorHandler;
const assertParameter = require('../../utils/assert.js').assertParameter;
const co = require('co');
const fs = require('co-fs-extra');

/**
 * @class
 * @memberOf mode.data
 * @extends {model.Loader}
 */
class DataLoader extends Loader {
    /**
     * @ignore
     */
    constructor(sitesRepository, pathesConfiguration, filenameTemplate) {
        super();

        //Check params
        assertParameter(this, 'sitesRepository', sitesRepository, true, SitesRepository);
        assertParameter(
            this,
            'pathesConfiguration',
            pathesConfiguration,
            true,
            PathesConfiguration
        );

        // Assign options
        this._sitesRepository = sitesRepository;
        this._pathesConfiguration = pathesConfiguration;
        this._filenameTemplate = filenameTemplate || '${sites}/${site.name.urlify()}/data.json';
        this._dataClass = Data;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [
                SitesRepository,
                PathesConfiguration,
                'model.data/DataLoader.filenameTemplate'
            ]
        };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'model.data/DataLoader';
    }

    /**
     * @type {model.site.SitesRepository}
     */
    get sitesRepository() {
        return this._sitesRepository;
    }

    /**
     * @type {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration() {
        return this._pathesConfiguration;
    }

    /**
     * @type {String}
     */
    get filenameTemplate() {
        return this._filenameTemplate;
    }

    /**
     * @type {model.data.Data}
     */
    get dataClass() {
        return this._dataClass;
    }

    /**
     * Generates a filename for the given site
     *
     * @returns {String}
     */
    generateFilename(data) {
        return this.pathesConfiguration.resolve(this.filenameTemplate, data);
    }

    /**
     * Loads all Translations
     *
     * @returns {Promise.<Array>}
     */
    load(changes) {
        const scope = this;
        const promise = co(function*() {
            const sites = Array.isArray(changes) ? changes : yield scope.sitesRepository.getItems();
            const result = [];
            const filesProcessed = {};
            for (const site of sites) {
                const filename = yield scope.generateFilename({ site: site });
                if (!filesProcessed[filename]) {
                    const fileExists = yield fs.exists(filename);
                    if (fileExists) {
                        const data = JSON.parse(yield fs.readFile(filename));
                        result.push(new scope.dataClass({ data: data, site: site }));
                    }
                    filesProcessed[filename] = true;
                }
            }
            return result;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.DataLoader = DataLoader;
