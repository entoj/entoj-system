'use strict';

/**
 * Requirements
 * @ignore
 */
const Data = require('../data/Data.js').Data;


/**
 * @memberOf model.translation
 * @extends {model.data.Data}
 */
class Translation extends Data
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.translation/Translation';
    }


    /**
     * @inheritDoc
     */
    get fields()
    {
        const fields = super.fields;
        fields.language = 'en_US';
        return fields;
    }


    /**
     * @inheritDoc
     */
    initialize()
    {
        super.initialize();
        this._language = 'en_US';
    }


    /**
     * The translation language
     *
     * @property {model.site.Site}
     */
    get language()
    {
        return this._language;
    }

    set language(value)
    {
        this._language = value;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Translation = Translation;
