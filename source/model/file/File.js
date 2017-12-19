'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueObject = require('../ValueObject.js').ValueObject;
const ContentType = require('../ContentType.js').ContentType;
const ContentKind = require('../ContentKind.js').ContentKind;
const path = require('path');
const fs = require('fs');


/**
 * @memberOf file
 * @extends {Base}
 */
class File extends ValueObject
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.file/File';
    }


    /**
     * @inheritDocs
     */
    get fields()
    {
        const fields = super.fields;
        fields.filename = '';
        fields.contentType = ContentType.ANY;
        fields.contentKind = ContentKind.UNKNOWN;
        fields.contents = undefined;
        fields.site = false;
        return fields;
    }


    /**
     * The site (aspect) this file belongs to.
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
     * @type {String}
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
     * @type {String}
     * @see model.ContentType
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
     * The full filename
     * All other getters are dervived from filenme.
     *
     * @type {String}
     */
    get filename()
    {
        return this._filename;
    }

    set filename(value)
    {
        this._filename = path.normalize(value);
        this._basename = path.basename(this._filename);
        this._path = path.dirname(this._filename);
        this._extension = path.extname(this._filename);
        this._contents = undefined;
    }


    /**
     * The name of the file without any directories
     *
     * @type {String}
     */
    get basename()
    {
        return this._basename;
    }


    /**
     * The directory part of the filename
     *
     * @type {String}
     */
    get path()
    {
        return this._path;
    }


    /**
     * The file extension (including the dot)
     *
     * @type {String}
     */
    get extension()
    {
        return this._extension;
    }


    /**
     * The file contents.
     * Keep in mind that this will be cached.
     *
     * @type {String}
     */
    get contents()
    {
        if (!this._contents && this._filename)
        {
            try
            {
                if (fs.existsSync(this._filename))
                {
                    this._contents = fs.readFileSync(this._filename, { encoding: 'utf8' });
                }
            }
            catch(e)
            {
                this._contents = undefined;
            }
        }
        return this._contents;
    }

    set contents(value)
    {
        this._contents = value;
    }


    /**
     * @inheritDoc
     */
    toString()
    {
        return `[${this.className} ${this.filename}]`;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.File = File;
