'use strict';

/**
 * Requirements
 * @ignore
 */
const LoaderPlugin = require('../LoaderPlugin.js').LoaderPlugin;
const PathesConfiguration = require('../../configuration/PathesConfiguration.js').PathesConfiguration;
const GlobalConfiguration = require('../../configuration/GlobalConfiguration.js').GlobalConfiguration;
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
     * @param {model.configuration.GlobalConfiguration} globalConfiguration
     * @param {object|undefined} options
     */
    constructor(pathesConfiguration, globalConfiguration, settingsRepository, options)
    {
        super();

        //Check params
        assertParameter(this, 'pathesConfiguration', pathesConfiguration, true, PathesConfiguration);
        assertParameter(this, 'globalConfiguration', globalConfiguration, true, GlobalConfiguration);

        // Assign options
        const opts = options || {};
        this._pathesConfiguration = pathesConfiguration;
        this._globalConfiguration = globalConfiguration;
        this._filename = opts.filename || '/entity.json';
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [PathesConfiguration, GlobalConfiguration, 'model.loader.documentation/PackagePlugin.options'] };
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
     * @property {model.configuration.GlobalConfiguration}
     */
    get globalConfiguration()
    {
        return this._globalConfiguration;
    }


    /**
     * @property {model.setting.SettingsRepository}
     */
    get settingsRepository()
    {
        return this._settingsRepository;
    }


    /**
     * @param {String} content
     */
    parse(content)
    {
        const result = JSON.parse(content);

        // Enhance example settings
        if (result && result.examples && result.examples.settings)
        {
            for (const setting of result.examples.settings)
            {
                if (setting.type == 'language')
                {
                    setting.name = setting.name || 'language';
                    setting.label = setting.label || 'Language';
                    setting.type = 'select';
                    setting.items = this.globalConfiguration.get('languages.list', []);
                    setting.default = this.globalConfiguration.get('languages.active', 'en_US');
                }
                if (setting.type == 'locale')
                {
                    setting.name = setting.name || 'locale';
                    setting.label = setting.label || 'Locale';
                    setting.type = 'select';
                    setting.items = this.globalConfiguration.get('languages.list', []);
                    setting.default = this.globalConfiguration.get('languages.active', 'en_US');
                }
            }
        }

        return Promise.resolve(result);
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
