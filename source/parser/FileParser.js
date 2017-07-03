'use strict';

/**
 * Requirements
 * @ignore
 */
const Parser = require('./Parser.js').Parser;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const File = require('../model/file/File.js').File;
const ContentType = require('../model/ContentType.js').ContentType;
const ContentKind = require('../model/ContentKind.js').ContentKind;
const glob = require('../utils/glob.js');
const co = require('co');

/**
 * Reads files based on glob patterns
 * @memberOf parser
 */
class FileParser extends Parser
{
    /**
     * @param {object|undefined} options
     * @param {parser.Parser} options.parser - a parser instance that is applied to all files read
     * @param {Array} options.glob - a list of glob pathes that will be queried
     */
    constructor(options)
    {
        super();

        // Assign options
        const opts = options || {};
        this._parser = opts.parser || false;
        this._glob = opts.glob || [];
        this._fileType = opts.fileType || ContentType.ANY;
        this._fileKind = opts.fileKind || ContentKind.UNKNOWN;

        // Add parser
        if (!this._parser)
        {
            this._parser = new Parser();
        }
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': ['parser/FileParser.options'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'parser/FileParser';
    }


    /**
     * @property {parser.Parser}
     */
    get parser()
    {
        return this._parser;
    }


    /**
     * @property {Array}
     */
    get glob()
    {
        return this._glob;
    }


    /**
     * @property {String}
     */
    get fileType()
    {
        return this._fileType;
    }


    /**
     * @property {String}
     */
    get fileKind()
    {
        return this._fileKind;
    }


    /**
     * Parses a file
     *
     * @protected
     * @param {model.file.File} file
     * @returns {Promise.<Array>}
     */
    parseFile(file)
    {
        if (!this._parser)
        {
            return Promise.resolve(false);
        }

        const scope = this;
        const promise = co(function*()
        {
            // Parse
            let result = yield scope._parser.parse(file.contents);
            if (!result)
            {
                return false;
            }

            if (!Array.isArray(result))
            {
                result = [result];
            }

            // Add file
            for (const documentation of result)
            {
                documentation.file = file;
                if (!documentation.name)
                {
                    documentation.name = file.basename;
                }
            }

            return result;
        });

        return promise;
    }


    /**
     * @inheritDocs
     */
    parse(content, options)
    {
        const scope = this;
        const result =
        {
            files: [],
            items: []
        };
        const promise = co(function*()
        {
            // Options
            const opts = options || {};

            // Get files
            const root = content || '/';
            const fileType = opts.fileType || scope.fileType;
            const fileKind = opts.fileKind || scope.fileKind;
            const globs = opts.glob || scope.glob || [];
            const files = yield glob(globs, { root: root });
            if (!files || !files.length)
            {
                return result;
            }

            // Read & parse
            for (const filename of files)
            {
                const file = new File({ filename: filename, contentType: fileType, contentKind: fileKind });
                result.files.push(file);
                if (file.contents)
                {
                    const items = yield scope.parseFile(file);
                    if (items)
                    {
                        Array.prototype.push.apply(result.items, items);
                    }
                }
            }

            return result;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.FileParser = FileParser;
