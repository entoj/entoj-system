'use strict';

/**
 * Requirements
 * @ignore
 */
const LoaderPlugin = require('../LoaderPlugin.js').LoaderPlugin;
const PathesConfiguration = require('../../configuration/PathesConfiguration.js').PathesConfiguration;
const Entity = require('../../entity/Entity.js').Entity;
const Site = require('../../site/Site.js').Site;
const assertParameter = require('../../../utils/assert.js').assertParameter;
const co = require('co');
const fs = require('co-fs-extra');


/**
 * Reads the entity specific configuration file
 */
class PackagePlugin extends LoaderPlugin
{
    /**
     * @param {model.configuration.PathesConfiguration} pathesConfiguration
     * @param {String} filename Entity relative filename to package file
     */
    constructor(pathesConfiguration, filename)
    {
        super();

        //Check params
        assertParameter(this, 'pathesConfiguration', pathesConfiguration, true, PathesConfiguration);

        // Assign options
        this._pathesConfiguration = pathesConfiguration;
        this._filename = filename || '/entity.json';
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [PathesConfiguration, 'model.loader.documentation/PackagePlugin.filename'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.loader.documentation/PackagePlugin';
    }


    /**
     * @property {string}
     */
    get filename()
    {
        return this._filename;
    }


    /**
     * @property {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration()
    {
        return this._pathesConfiguration;
    }


    /**
     * @param {String} content
     */
    parse(content)
    {
        return Promise.resolve(JSON.parse(content));
    }


    /**
     * @param {model.entity.Entity} item
     * @param {model.site.Site} site
     */
    executeFor(item, site)
    {
        // Guards
        assertParameter(this, 'item', item, true, [Entity, Site]);
        assertParameter(this, 'site', site, false, Site);

        const scope = this;
        const promise = co(function*()
        {
            // Get filename
            let filename;
            if (!site)
            {
                filename = yield scope._pathesConfiguration.resolve(item, scope.filename);
            }
            else
            {
                filename = yield scope._pathesConfiguration.resolveEntityForSite(item, site, scope.filename);
            }

            // Check file
            const exists = yield fs.exists(filename);
            /* istanbul ignore next */
            if (!exists)
            {
                scope.logger.debug('Could not find file', filename);
                return false;
            }

            // Read it
            const content = yield fs.readFile(filename);
            /* istanbul ignore next */
            if (!content)
            {
                scope.logger.warn('Could not read file', filename);
                return false;
            }

            // Parse it
            let data = false;
            try
            {
                data = yield scope.parse(content);
            }
            catch(e)
            {
                /* istanbul ignore next */
                scope.logger.error('Could not parse file', filename, e);
                /* istanbul ignore next */
                return false;
            }

            // Add data to item
            if (data)
            {
                // Get site
                let s = site;
                if (!s && item.id && item.id.site)
                {
                    s = item.id.site;
                }

                // Add namespaced
                if (s)
                {
                    const namespacedData = {};
                    namespacedData[s.name.toLowerCase()] = data;
                    item.properties.load(namespacedData);
                }
                // Add straight
                else
                {
                    item.properties.load(data);
                }
            }

            return true;
        });
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.PackagePlugin = PackagePlugin;
