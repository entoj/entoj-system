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
const fs = require('mz/fs');

/**
 * Reads entity example files
 */
class PackagePlugin extends LoaderPlugin
{
    /**
     * @param {configuration.PathesConfiguration} pathesConfiguration
     * @param {object|undefined} options
     */
    constructor(pathesConfiguration, options)
    {
        super();

        //Check params
        assertParameter(this, 'pathesConfiguration', pathesConfiguration, true, PathesConfiguration);

        // Assign options
        const opts = options || {};
        this._pathesConfiguration = pathesConfiguration;
        this._filename = opts.filename || '/entity.json';
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [PathesConfiguration, 'model.loader.documentation/PackagePlugin.options'] };
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
     * @param {DocumentableValueObject} item
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
                data = JSON.parse(content);
            }
            catch(e)
            {
                /* istanbul ignore next */
                scope.logger.warn('Could not parse file', filename, e);
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
