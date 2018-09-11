'use strict';

/**
 * Requirements
 * @ignore
 */
const FileLinter = require('./FileLinter.js').FileLinter;
const NunjucksLinter = require('./NunjucksLinter.js').NunjucksLinter;
const EntityRenderer = require('../nunjucks/EntityRenderer.js').EntityRenderer;
const assertParameter = require('../utils/assert.js').assertParameter;

/**
 * A nunjucks file linter
 */
class NunjucksFileLinter extends FileLinter {
    /**
     * @param {object|undefined} rules
     * @param {object|undefined} options
     * @param {nunjucks.EntityRenderer} entityRenderer
     */
    constructor(rules, options, entityRenderer) {
        super(rules, options);

        // Check params
        assertParameter(this, 'entityRenderer', entityRenderer, true, EntityRenderer);

        // Assign
        const opts = options || {};
        this._linter = new NunjucksLinter(entityRenderer, opts);
        this._glob = opts.glob || ['/*.j2', '/examples/*.j2'];
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [
                'linter/NunjucksFileLinter.rules',
                'linter/NunjucksFileLinter.options',
                EntityRenderer
            ]
        };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'linter/NunjucksFileLinter';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.NunjucksFileLinter = NunjucksFileLinter;
