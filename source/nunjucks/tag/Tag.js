'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;


/**
 * @memberOf nunjucks
 */
class Tag extends Base
{
    /**
     * @param {Object} values
     */
    constructor(values)
    {
        super();

        // Assign options
        this._type = this.className.split('/').pop();
    }
    
    
    /**
     * The namespaced class name
     *
     * @type {string}
     * @static
     */
    static get className()
    {
        return 'nunjucks.tag/Tag';
    }


    /**
     * @property {String}
     */
    get type()
    {
        return this._type;
    }


    /**
     * @type {Array}
     */
    get tags()
    {
        return ['tag'];
    }


    /**
     * @returns {Boolean|String}
     */
    parse(parser, nodes, lexer)
    {
        // get the tag token
        const tok = parser.nextToken();

        // parse the args and move after the block end. passing true
        // as the second arg is required if there are no parentheses
        const args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        
        // parse the body and possibly the error block, which is optional
        const body = parser.parseUntilBlocks('end' + this.tags[0]);
        parser.advanceAfterBlockEnd();

        // See above for notes about CallExtension
        const result = new nodes.CallExtension(this, 'run', args, [body]);

        return result;
    }


    /**
     * Runs the tag
     */
    run(context, ...params)
    {
        return '';
    }


    /**
     * Registers the tag with a nunjucks environent.
     *
     * @param {nunjucks.Environment} environment
     * @returns {Boolean}
     */
    register(environment)
    {
        if (!environment)
        {
            return false;
        }

        environment.addExtension(this.tags.pop(), this);
        this._environment = environment;
        return true;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Tag = Tag;
