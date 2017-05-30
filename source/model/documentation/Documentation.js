'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueObject = require('../ValueObject.js').ValueObject;
const ContentType = require('../ContentType.js').ContentType;
const ContentKind = require('../ContentKind.js').ContentKind;

/**
 * @memberOf model.documentation
 */
class Documentation extends ValueObject
{
    /**
     * @inheritDocs
     */
    get fields()
    {
        return {
            name: '',
            description: '',
            site: false,
            file: false,
            tags: [],
            group: '',
            contentType: ContentType.ANY,
            contentKind: ContentKind.UNKNOWN
        };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.documentation/Documentation';
    }


    /**
     * The site (aspect) this documentation belongs to.
     *
     * @property {model.site.Site}
     */
    get site()
    {
        return this._site;
    }

    set site(value)
    {
        this._site = value;
    }


    /**
     * The actual content type this documentation was extracted from.
     *
     * @see {model.ContentType}
     * @property {String}
     */
    get contentType()
    {
        return this._contentType;
    }

    set contentType(value)
    {
        this._contentType = value;
    }


    /**
     * The actual content kind this documentation was extracted from.
     *
     * @see {model.ContentKind}
     * @property {String}
     */
    get contentKind()
    {
        return this._contentKind;
    }

    set contentKind(value)
    {
        this._contentKind = value;
    }


    /**
     * @property {model.file.File}
     */
    get file()
    {
        return this._file;
    }

    set file(value)
    {
        this._file = value;
    }


    /**
     * @property {String}
     */
    get name()
    {
        return this._name;
    }

    set name(value)
    {
        this._name = value;
    }


    /**
     * @property {String}
     */
    get description()
    {
        return this._description;
    }

    set description(value)
    {
        this._description = value;
    }


    /**
     * @property {String}
     */
    get group()
    {
        return this._group;
    }

    set group(value)
    {
        this._group = value;
    }


    /**
     * @property {Array}
     */
    get tags()
    {
        return this._tags;
    }

    set tags(value)
    {
        this._tags = value;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Documentation = Documentation;
