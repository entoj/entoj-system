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


/**
 * Reads and parses files
 */
class ParserPlugin extends LoaderPlugin
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
        this._pathesConfiguration = pathesConfiguration;
        this._parser = false;
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [PathesConfiguration, 'model.loader.documentation/ParserPlugin.options'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.loader.documentation/ParserPlugin';
    }


    /**
     * @inheritDoc
     */
    get parser()
    {
        return this._parser;
    }


    /**
     * @inheritDoc
     */
    set parser(value)
    {
        this._parser = value;
    }


    /**
     * @param {DocumentableValueObject} item
     */
    executeFor(item, site)
    {
        // Guards
        if (!this._parser)
        {
            return Promise.resolve(true);
        }
        assertParameter(this, 'item', item, true, [Entity, Site]);
        assertParameter(this, 'site', site, false, Site);

        // Run
        const scope = this;
        const promise = co(function*()
        {
            let basePath;
            if (site && item)
            {
                basePath = yield scope._pathesConfiguration.resolveEntityForSite(item, site);
            }
            else
            {
                basePath = yield scope._pathesConfiguration.resolve(item);
            }
            const result = yield scope._parser.parse(basePath);
            if (result)
            {
                for (const file of result.files)
                {
                    if (site || item.id)
                    {
                        file.site = site || item.id.site;
                    }
                    item.files.push(file);
                }
                for (const documentation of result.items)
                {
                    if (site || item.id)
                    {
                        documentation.site = site || item.id.site;
                    }
                    item.documentation.push(documentation);
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
module.exports.ParserPlugin = ParserPlugin;
