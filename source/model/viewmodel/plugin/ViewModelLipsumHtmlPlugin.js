'use strict';

/**
 * Requirements
 * @ignore
 */
const ViewModelLipsumPlugin = require('./ViewModelLipsumPlugin.js').ViewModelLipsumPlugin;
const htmlify = require('../../../utils/string.js').htmlify;
const createRandomNumberGenerator = require('../../../utils/random.js').createRandomNumberGenerator;

/**
 * @class
 * @memberOf model.viewmodel.plugin
 * @extends {Base}
 */
class ViewModelLipsumHtmlPlugin extends ViewModelLipsumPlugin {
    /**
     * @inheritDoc
     */
    constructor() {
        super();
        this._name = ['lipsum-html', 'lipsum-inline'];
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'model.viewmodel.plugin/ViewModelLipsumHtmlPlugin';
    }

    /**
     * @inheritDoc
     */
    doExecute(repository, site, useStaticContent, name, parameters, options) {
        const random = createRandomNumberGenerator(useStaticContent);
        const tags = [
            {
                name: 'a',
                probability: 0.2,
                attributes: {
                    href: 'JavaScript:;'
                }
            },
            {
                name: ['b', 'i'],
                probability: 0.2
            }
        ];
        if (name == 'lipsum-html') {
            tags.push(
                {
                    name: 'h1',
                    probability: 0.3
                },
                {
                    name: ['h2', 'h3', 'h4', 'h5', 'em'],
                    probability: 0.4
                }
            );
        }
        const promise = super
            .doExecute(repository, site, useStaticContent, name, parameters)
            .then((text) => htmlify(text, { random: random, tags: tags }));
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ViewModelLipsumHtmlPlugin = ViewModelLipsumHtmlPlugin;
