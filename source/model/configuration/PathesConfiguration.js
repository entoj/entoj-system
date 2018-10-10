'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;
const EntityCategory = require('../entity/EntityCategory.js').EntityCategory;
const EntityId = require('../entity/EntityId.js').EntityId;
const Entity = require('../entity/Entity.js').Entity;
const EntityAspect = require('../entity/EntityAspect.js').EntityAspect;
const Site = require('../site/Site.js').Site;
const assertParameter = require('../../utils/assert.js').assertParameter;
const shortenMiddle = require('../../utils/string.js').shortenMiddle;
const trimSlashesLeft = require('../../utils/string.js').trimSlashesLeft;
const SystemModuleConfiguration = require('../../configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const path = require('path');
const templateString = require('es6-template-strings');
const merge = require('lodash.merge');

/**
 * Holds all path related configuration.
 *
 * Most pathes are configured via template strings
 *
 * @memberOf model.configuration
 */
class PathesConfiguration extends Base {
    /**
     * @param {configuration.SystemModuleConfiguration} moduleConfiguration
     */
    constructor(moduleConfiguration) {
        super();

        // Check
        assertParameter(
            this,
            'moduleConfiguration',
            moduleConfiguration,
            true,
            SystemModuleConfiguration
        );

        // Add parameters
        this._moduleConfiguration = moduleConfiguration;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: [SystemModuleConfiguration] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'model.configuration/PathesConfiguration';
    }

    /**
     * @type {configuration.SystemModuleConfiguration}
     */
    get moduleConfiguration() {
        return this._moduleConfiguration;
    }

    /**
     * Renders a path template.
     *
     * Provides access to most pathes and templates fro the template
     *
     * @private
     * @param {string} template
     * @param {object} variables
     * @param {bool} directReturn
     * @returns {Promise.<string>|string}
     */
    renderTemplate(template, variables, directReturn) {
        const configurationData = this.moduleConfiguration
            ? this.moduleConfiguration.getConfigurationAsObject()
            : {};
        const data = merge({}, configurationData, variables);
        //console.log(Object.keys(data));
        const result = path.resolve(templateString(template, data));
        if (directReturn === true) {
            return result;
        }
        return Promise.resolve(result);
    }

    /**
     * The root path for most other pathes
     *
     * Usable within templates via ${root}
     *
     * @type {String}
     */
    get root() {
        return this.moduleConfiguration.pathBase;
    }

    /**
     * The root path for the local entoj installation
     *
     * @type {String}
     */
    get entoj() {
        return this.moduleConfiguration.pathEntoj;
    }

    /**
     * The cache base path.
     *
     * Usable within path templates via ${cache}
     *
     * @type {String}
     */
    get cache() {
        return this.moduleConfiguration.pathCache;
    }

    /**
     * The data base path.
     *
     * Usable within path templates via ${data}
     *
     * @type {String}
     */
    get data() {
        return this.moduleConfiguration.pathData;
    }

    /**
     * The sites base path.
     *
     * Usable within path templates via ${templates}
     *
     * @type {String}
     */
    get sites() {
        return this.moduleConfiguration.pathSites;
    }

    /**
     * Resolve a path.
     *
     * This works by analyzing the parameters and deciding which
     * resolve* method should be used.
     *
     * @returns {Promise.<string>}
     */
    resolve() {
        if (!arguments.length) {
            return Promise.resolve(false);
        }

        // Get path
        let customPath = '';
        if (typeof arguments[arguments.length - 1] === 'string') {
            customPath = arguments[arguments.length - 1];
        }

        // Get main vo
        const mainVO = arguments[0];

        // Check Site
        if (mainVO instanceof Site) {
            return this.resolveSite(mainVO, customPath);
        }

        // Check EntityId
        if (mainVO instanceof EntityId) {
            return this.resolveEntityId(mainVO, customPath);
        }

        // Check Entity
        if (mainVO instanceof Entity) {
            return this.resolveEntity(mainVO, customPath);
        }

        // Check template
        if (typeof mainVO === 'string') {
            return this.renderTemplate(mainVO, arguments[1] || {});
        }

        return Promise.resolve(false);
    }

    /**
     * Makes the path relative to sites
     *
     * @param {string} pth
     * @returns {Promise.<string>}
     */
    relativeToSites(pth) {
        const result = trimSlashesLeft(
            path.resolve(pth.replace('file://', '')).replace(this.sites, '')
        );
        return Promise.resolve(result);
    }

    /**
     * Shortens a path for display usage
     *
     * @param {string} pth
     * @param {number} maxLength
     * @returns {Promise.<string>}
     */
    shorten(pth, maxLength) {
        let result = path.resolve(pth.replace('file://', '')).replace(this.root, '');
        if (maxLength) {
            result = shortenMiddle(result, maxLength);
        }
        return Promise.resolve(result);
    }

    /**
     * Resolve a Cache path.
     *
     * @param {string} customPath
     * @returns {Promise.<string>}
     */
    resolveCache(customPath) {
        const result = path.resolve(path.join(this.cache, customPath));
        return Promise.resolve(result);
    }

    /**
     * Resolve a Data path.
     *
     * @param {string} customPath
     * @returns {Promise.<string>}
     */
    resolveData(customPath) {
        const result = path.resolve(path.join(this.data, customPath));
        return Promise.resolve(result);
    }

    /**
     * Resolve a Site path.
     *
     * @param {Site} site
     * @param {string} customPath
     * @returns {Promise.<string>}
     */
    resolveSite(site, customPath) {
        // Check parameters
        assertParameter(this, 'site', site, true, Site);

        // Resolve path
        return this.renderTemplate(
            this.moduleConfiguration.pathSite + (customPath ? customPath : ''),
            {
                site: site
            }
        );
    }

    /**
     * Resolve a EntityCategory path
     *
     * @param {Site} Site
     * @param {EntityCategory} entityCategory
     * @param {string} customPath
     * @returns {Promise.<string>}
     */
    resolveEntityCategory(site, entityCategory, customPath) {
        // Check parameters
        assertParameter(this, 'site', site, true, Site);
        assertParameter(this, 'entityCategory', entityCategory, true, EntityCategory);

        // Resolve path
        return this.renderTemplate(
            this.moduleConfiguration.pathEntityCategory + (customPath ? customPath : ''),
            {
                site: site,
                entityCategory: entityCategory
            }
        );
    }

    /**
     * Resolve a EntityId path for a specific site
     *
     * @param {EntityId} entityId
     * @param {Site} site
     * @param {string} customPath
     * @returns {Promise.<string>}
     */
    resolveEntityIdForSite(entityId, site, customPath) {
        // Check parameters
        assertParameter(this, 'entityId', entityId, true, EntityId);
        assertParameter(this, 'site', site, true, Site);

        let template = this.moduleConfiguration.pathEntityId;
        if (entityId.isGlobal) {
            template = this.moduleConfiguration.pathEntityCategory;
        }

        // Resolve path
        return this.renderTemplate(template + (customPath ? customPath : ''), {
            site: site,
            entityCategory: entityId.category,
            entityId: entityId
        });
    }

    /**
     * Resolve a EntityId path
     *
     * @param {EntityId} entityId
     * @param {string} customPath
     * @returns {Promise.<string>}
     */
    resolveEntityId(entityId, customPath) {
        return this.resolveEntityIdForSite(entityId, entityId.site, customPath);
    }

    /**
     * Resolve a Entity path
     *
     * @param {Entity} entity
     * @param {string} customPath
     * @returns {Promise.<string>}
     */
    resolveEntity(entity, customPath) {
        // Check parameters
        assertParameter(this, 'entity', entity, true, [Entity, EntityAspect]);

        // Resolve path
        return this.resolveEntityId(entity.id, customPath);
    }

    /**
     * Resolve a Entity path for a specific site
     *
     * @param {Entity} entity
     * @param {Site} site
     * @param {string} customPath
     * @returns {Promise.<string>}
     */
    resolveEntityForSite(entity, site, customPath) {
        // Check parameters
        assertParameter(this, 'entity', entity, true, [Entity, EntityAspect]);
        assertParameter(this, 'site', site, true, Site);

        // Resolve path
        return this.resolveEntityIdForSite(entity.id, site, customPath);
    }

    /**
     * @inheritDoc
     */
    toString() {
        return `[${this.className} ${this.root}`;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.PathesConfiguration = PathesConfiguration;
