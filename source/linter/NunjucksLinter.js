'use strict';

/**
 * Requirements
 * @ignore
 */
const Linter = require('./Linter.js').Linter;
const ContentKind = require('../model/ContentKind.js').ContentKind;
const EntityRenderer = require('../nunjucks/EntityRenderer.js').EntityRenderer;
const assertParameter = require('../utils/assert.js').assertParameter;
const co = require('co');

/**
 * A very simple nunjucks linter.
 * It actually only tests if the template contains errors.
 */
class NunjucksLinter extends Linter {
    /**
     * @param {Object} options
     */
    constructor(entityRenderer) {
        super();

        // Check params
        assertParameter(this, 'entityRenderer', entityRenderer, true, EntityRenderer);

        // Assign
        this._entityRenderer = entityRenderer;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: [EntityRenderer] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'linter/NunjucksLinter';
    }

    /**
     * @type {String}
     */
    get name() {
        return 'TEMPLATE';
    }

    /**
     * @type {String}
     */
    get contentKind() {
        return ContentKind.MACRO;
    }

    /**
     * @type {nunjucks.EntityRenderer}
     */
    get entityRenderer() {
        return this._entityRenderer;
    }

    /**
     * @inheritDoc
     */
    lint(content, options) {
        const scope = this;
        const promise = co(function*() {
            const result = {
                success: true,
                errorCount: 0,
                warningCount: 0,
                messages: []
            };

            // Check
            const opts = options || {};
            if (!content || content.trim() === '' || !opts.entity) {
                return result;
            }

            // try to render
            try {
                yield scope.entityRenderer.renderString(
                    content,
                    false,
                    options.entity,
                    options.entity.id.site
                );
            } catch (e) {
                result.success = false;
                result.errorCount = 1;
                result.messages.push({
                    message: e.message.replace(/\n/g, '').substr(-100),
                    severity: 1,
                    line: 0
                });
            }

            // Massage messages
            result.messages = result.messages.map(function(message) {
                if (opts.filename) {
                    message.filename = opts.filename;
                }
                message.linter = scope.className;
                return message;
            });

            return result;
        });
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.NunjucksLinter = NunjucksLinter;
