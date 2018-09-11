'use strict';

/**
 * Requirements
 * @ignore
 */
const ViewModelPlugin = require('../ViewModelPlugin.js').ViewModelPlugin;
const createRandomNumberGenerator = require('../../../utils/random.js').createRandomNumberGenerator;
const uppercaseFirst = require('../../../utils/string.js').uppercaseFirst;
const lorem = require('lorem-ipsum');

/**
 * @class
 * @memberOf model.viewmodel.plugin
 * @extends {Base}
 */
class ViewModelLipsumPlugin extends ViewModelPlugin {
    /**
     * @inheritDoc
     */
    constructor() {
        super();
        this._name = ['lipsum'];
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'model.viewmodel.plugin/ViewModelLipsumPlugin';
    }

    /**
     * @inheritDoc
     */
    doExecute(repository, site, useStaticContent, name, parameters, options) {
        // Prepare
        const lipsumOptions = {
            units: 'words',
            count: 1,
            random: createRandomNumberGenerator(useStaticContent)
        };

        // Parse params
        const params = (parameters || '').split(',');
        if (params.length && params[0] == '') {
            params.shift();
        }
        let min = 1;
        let max = 10;
        if (params.length > 0) {
            // Get unit
            if (params[0] == 'w' || params[0] == 's' || params[0] == 'p') {
                const unitsShort = params.shift();
                if (unitsShort == 's') {
                    lipsumOptions.units = 'sentences';
                }
                if (unitsShort == 'p') {
                    lipsumOptions.units = 'paragraphs';
                }
            }

            // Get counts
            if (params.length == 1) {
                max = parseInt(params[0], 10);
            } else if (params.length == 2) {
                min = parseInt(params[0], 10);
                max = parseInt(params[1], 10);
            }
        }
        lipsumOptions.count = useStaticContent ? max : min + (max - min) * Math.random();

        // Go
        return Promise.resolve(uppercaseFirst(lorem(lipsumOptions)));
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ViewModelLipsumPlugin = ViewModelLipsumPlugin;
