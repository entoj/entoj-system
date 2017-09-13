'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;
const IdParser = require('../../parser/entity/IdParser.js').IdParser;
const assertParameter = require('../../utils/assert.js').assertParameter;
const compile = require('es6-template-strings/compile');
const resolveToString = require('es6-template-strings/resolve-to-string');


/**
 * Renders a template string for id's
 */
class EntityIdTemplate extends Base
{
    /**
     * @param {parser.entity.IdParser} idParser
     * @param {Object} options
     */
    constructor(idParser, options)
    {
        super();

        // Check params
        assertParameter(this, 'idParser', idParser, true, IdParser);

        // Assign options
        this._idParser = idParser;
        this._options = options || {};

        // Precompile
        this._templates = {};
        this._templates[IdParser.TEMPLATE_CATEGORY] = compile(this._idParser.getTemplate(IdParser.TEMPLATE_CATEGORY));
        this._templates[IdParser.TEMPLATE_ID] = compile(this._idParser.getTemplate(IdParser.TEMPLATE_ID));
        this._templates[IdParser.TEMPLATE_CATEGORY_PATH] = compile(this._idParser.getTemplate(IdParser.TEMPLATE_CATEGORY_PATH));
        this._templates[IdParser.TEMPLATE_ID_PATH] = compile(this._idParser.getTemplate(IdParser.TEMPLATE_ID_PATH));
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [IdParser, 'model.entity/EntityIdTemplate.options'] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model.entity/EntityIdTemplate';
    }


    /**
     * @type {Object}
     */
    get templates()
    {
        return this._templates;
    }


    /**
     * @param {EntityId} entityId
     * @returns {String}
     */
    id(entityId)
    {
        if (!entityId)
        {
            return '';
        }

        const data =
        {
            entityId: entityId,
            entityCategory: entityId.category,
            site: entityId.site
        };
        const template = entityId.isGlobal
            ? this.templates[IdParser.TEMPLATE_CATEGORY]
            : this.templates[IdParser.TEMPLATE_ID];
        return resolveToString(template, data);
    }


    /**
     * @param {EntityId} entityId
     * @returns {String}
     */
    path(entityId)
    {
        if (!entityId)
        {
            return '';
        }

        const data =
        {
            entityId: entityId,
            entityCategory: entityId.category,
            site: entityId.site
        };
        const template = entityId.isGlobal
            ? this.templates[IdParser.TEMPLATE_CATEGORY_PATH]
            : this.templates[IdParser.TEMPLATE_ID_PATH];
        return resolveToString(template, data);
    }


    /**
     * @inheritDocs
     */
    toString()
    {
        return `[${this.className}]`;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EntityIdTemplate = EntityIdTemplate;
