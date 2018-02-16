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
     */
    constructor()
    {
        super();

        // Assign options
        this._type = this.className.split('/').pop();
        this._hasBody = true;
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
     * @property {model.configuration.BuildConfiguration}
     */
    get environment()
    {
        return this._environment;
    }


    /**
     * @type {Array}
     */
    get name()
    {
        return ['tag'];
    }


    /**
     * @type {Array}
     * @protected
     */
    get tags()
    {
        return this.name;
    }  


    /**
     * Single tag or wrapping tag?
     * 
     * @type {Boolean}
     * @protected
     */
    get hasBody()
    {
        return this._hasBody;
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
        
        // parse the body
        const body = [];
        if (this.hasBody)
        {
            body.push(parser.parseUntilBlocks('end' + tok.value));
            parser.advanceAfterBlockEnd();    
        }

        // Call __generate__ on each tag invocation
        const result = new nodes.CallExtension(this, '__generate__', args, body);
        return result;
    }


    /**
     * Normalizes generate params
     * @protected
     */
    __generate__(context, params, caller)
    {
        if (typeof params === 'function')
        {
            return this.generate(context, {}, params);
        }
        return this.generate(context, params, caller);
    }
    

    /**
     * Generate the tag contents
     */
    generate(context, params, caller)
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

        for (const name of this.name)
        {
            environment.addExtension(name, this);
        }
        this._environment = environment;
        return true;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Tag = Tag;
