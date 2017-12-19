'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const EntitiesRepository = require('../model/entity/EntitiesRepository.js').EntitiesRepository;
const CallParser = require('../parser/jinja/CallParser.js').CallParser;
const ContentType = require('../model/ContentType.js').ContentType;
const DocumentationCallable = require('../model/documentation/DocumentationCallable.js').DocumentationCallable;
const synchronize = require('../utils/synchronize.js');
const urls = require('../utils/urls.js');
const activateEnvironment = require('../utils/string.js').activateEnvironment;
const unique = require('lodash.uniq');
const assertParameter = require('../utils/assert.js').assertParameter;
const crypto = require('crypto');

/**
 * Template cache
 * @type {Map}
 */
const templates = new Map();
let templateCacheEnabled = false;


/**
 * Enables the template cache
 */
function enableTemplateCache()
{
    templateCacheEnabled = true;
}


/**
 * Disables the template cache
 */
function disableTemplateCache()
{
    templateCacheEnabled = false;
}


/**
 * @memberOf nunjucks
 */
class Template extends Base
{
    /**
     * @param {EntitiesRepository} entitiesRepository
     * @param {Object} options
     */
    constructor(entitiesRepository, templatePaths, environment)
    {
        super();

        // Check params
        assertParameter(this, 'entitiesRepository', entitiesRepository, true, EntitiesRepository);

        // Add options
        this.templatePaths = templatePaths || [];
        this._environment = environment || '';
        this._entitiesRepository = entitiesRepository;
        this._callParser = new CallParser();
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [EntitiesRepository, 'nunjucks/Template.templatePaths', 'nunjucks/Template.options'] };
    }


    /**
     * The namespaced class name
     *
     * @type {string}
     * @static
     */
    static get className()
    {
        return 'nunjucks/Template';
    }


    /**
     * Returns the templates base path used for resolving macro include pathes.
     *
     * @type {string}
     */
    get templatePaths()
    {
        return this._templatePaths.slice();
    }


    /**
     * @type {string}
     */
    set templatePaths(value)
    {
        this._templatePaths = Array.isArray(value) ? value.slice() : [value];
    }


    /**
     * @returns {Boolean|String}
     */
    getInclude(name, site)
    {
        const items = synchronize.execute(this._entitiesRepository, 'getItems');
        for (const item of items)
        {
            // Get all matching macros
            const macros = item.documentation.filter((doc) =>
            {
                return doc.contentType == ContentType.JINJA &&
                    doc instanceof DocumentationCallable &&
                    doc.name == name;
            });

            // Default to first found
            let macro = macros.length
                ? macros[0]
                : false;

            // Process
            if (macro)
            {
                // Prefer macro that matches given site
                if (site)
                {
                    const preferedMacro = macros.find((macro) => macro.site.isEqualTo(site));
                    if (preferedMacro)
                    {
                        macro = preferedMacro;
                    }
                }

                // Build include
                let from = macro.file.filename;
                for (const templatePath of this.templatePaths)
                {
                    from = from.replace(templatePath, '');
                }
                return '{% from "' + urls.normalize(from) + '" import ' + macro.name + ' %}';
            }
        }
        return false;
    }


    /**
     * Prepares a template for rendering
     */
    prepare(content, location)
    {
        // Get site
        const site = location && location.site
            ? location.site
            : false;

        // Check cache
        let hash = false;
        if (templateCacheEnabled)
        {
            hash = crypto.createHash('md5').update((site ? site.name : 'Default') + '::' + content).digest('hex');
            if (templates.has(hash))
            {
                this.logger.verbose('Using cached template');
                return templates.get(hash);
            }
        }

        // Get macros
        const macros = synchronize.execute(this._callParser, 'parse', [content]);

        // Build includes
        let includes = [];
        for (const macro of macros.externals)
        {
            const include = this.getInclude(macro, site);
            if (include)
            {
                includes.push(include);
            }
        }
        includes = unique(includes);

        // Update template
        let result = content;
        for (const include of includes)
        {
            result = include + '\n' + result;
        }

        // Activate environments
        result = activateEnvironment(result, this._environment);

        // Update cache
        if (templateCacheEnabled)
        {
            templates.set(hash, result);
        }

        this.logger.verbose('Prepared Template');
        return result;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Template = Template;
module.exports.enableTemplateCache = enableTemplateCache;
module.exports.disableTemplateCache = disableTemplateCache;
