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


/**
 * @memberOf nunjucks
 */
class Template extends Base
{
    /**
     * @param {EntitiesRepository} entitiesRepository
     * @param {Object} options
     */
    constructor(entitiesRepository, basePath, environment)
    {
        super();

        // Check params
        assertParameter(this, 'entitiesRepository', entitiesRepository, true, EntitiesRepository);

        // Add options
        this._basePath = basePath || '';
        this._environment = environment || '';
        this._entitiesRepository = entitiesRepository;
        this._callParser = new CallParser();
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [EntitiesRepository, 'nunjucks/Template.options'] };
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
    get basePath()
    {
        return this._basePath;
    }


    /**
     * @type {string}
     */
    set basePath(value)
    {
        this._basePath = value;
    }


    /**
     * @returns {Boolean|String}
     */
    getInclude(name)
    {
        const items = synchronize.execute(this._entitiesRepository, 'getItems');
        for (const item of items)
        {
            const macros = item.documentation.filter(doc => doc.contentType == ContentType.JINJA && doc instanceof DocumentationCallable);
            for (const macro of macros)
            {
                if (macro.name === name)
                {
                    return '{% from "' + urls.normalize(macro.file.filename.replace(this.basePath, '')) + '" import ' + macro.name + ' %}';
                }
            }
        }
        return false;
    }


    /**
     * Prepares a template for rendering
     */
    prepare(content)
    {
        // Get macros
        const macros = synchronize.execute(this._callParser, 'parse', [content]);

        // Build includes
        let includes = [];
        for (const macro of macros.externals)
        {
            const include = this.getInclude(macro);
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

        this.logger.verbose('Prepared Template\n', result);

        return result;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Template = Template;
