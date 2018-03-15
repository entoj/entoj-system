'use strict';

/**
 * Requirements
 * @ignore
 */
const DocumentableValueObject = require('../DocumentableValueObject.js').DocumentableValueObject;
const EntityCategoryType = require('./EntityCategoryType.js').EntityCategoryType;


/**
 * Describes entity categories in the system.
 * The main property of a category is its long name.
 *
 * A Common example would be catefgories like elements, modules, module groups
 *
 * @memberOf model.entity
 */
class EntityCategory extends DocumentableValueObject
{
    /**
     * @constant {string}
     * @static
     */
    static get LONG_NAME()
    {
        return 'longName';
    }

    /**
     * @constant {string}
     * @static
     */
    static get SHORT_NAME()
    {
        return 'shortName';
    }

    /**
     * @constant {string}
     * @static
     */
    static get PLURAL_NAME()
    {
        return 'pluralName';
    }

    /**
     * @constant {array}
     * @static
     */
    static get ANY()
    {
        return ['longName', 'shortName', 'pluralName'];
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model.entity/EntityCategory';
    }


    /**
     * @inheritDocs
     */
    get fields()
    {
        const fields = super.fields;
        fields.longName = '';
        fields.shortName = '';
        fields.pluralName = '';
        fields.type = EntityCategoryType.PATTERN;
        fields.priority = 0;
        return fields;
    }


    /**
     * @inheritDocs
     */
    get uniqueId()
    {
        return this._longName + this._isGlobal;
    }


    /**
     * @property {String}
     */
    get longName()
    {
        return this._longName;
    }

    set longName(value)
    {
        this._longName = value;
    }


    /**
     * @property {String}
     */
    get shortName()
    {
        return this._shortName;
    }

    set shortName(value)
    {
        this._shortName = value;
    }


    /**
     * @property {String}
     */
    get pluralName()
    {
        return this._pluralName;
    }

    set pluralName(value)
    {
        this._pluralName = value;
    }


    /**
     * @property {Bool}
     */
    get isGlobal()
    {
        return this.type === EntityCategoryType.GLOBAL;
    }


    /**
     * @property {String}
     */
    get type()
    {
        return this._type;
    }

    set type(value)
    {
        this._type = value;
    }


    /**
     * The priority of the category.
     * Higher priority categories depend on lower priority categories.
     *
     * @property {Bool}
     */
    get priority()
    {
        return this._priority;
    }

    set priority(value)
    {
        this._priority = value;
    }


    /**
     * @inheritDocs
     */
    dehydrate(values)
    {
        super.dehydrate(values);
        if (!this.pluralName.length)
        {
            this.pluralName = this.longName + 's';
        }
        if (!this.shortName.length)
        {
            this.shortName = this.longName.substr(0, 1).toLowerCase();
        }
        // Support deprecated way of declaring global categories
        if (values &&
            typeof values.isGlobal !== 'undefined' &&
            values.isGlobal === true)
        {
            this.type = EntityCategoryType.GLOBAL;
        }
        // Add some sane magic categories
        if (values &&
            !values.type)
        {
            switch(this.longName.toLowerCase())
            {
                case 'page':
                    this.type = EntityCategoryType.PAGE;
                    break;

                case 'template':
                    this.type = EntityCategoryType.TEMPLATE;
                    break;
            }
        }
    }


    /**
     * @inheritDocs
     */
    toString()
    {
        return `[${this.className} ${this.longName}]`;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EntityCategory = EntityCategory;
