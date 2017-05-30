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
class ViewModelLipsumPlugin extends ViewModelPlugin
{
    /**
     * @inheritDocs
     */
    constructor()
    {
        super();
        this.name = ['lipsum'];
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model.viewmodel.plugin/ViewModelLipsumPlugin';
    }


    /**
     * @inheritDocs
     */
    doExecute(repository, site, useStaticContent, name, parameters)
    {
        // Prepare
        const options =
        {
            units: 'words',
            count: 1,
            random: createRandomNumberGenerator(useStaticContent)
        };

        // Parse params
        const params = (parameters || '').split(',');
        if (params.length && params[0] == '')
        {
            params.shift();
        }
        let min = 1;
        let max = 10;
        if (params.length > 0)
        {
            // Get unit
            if (params[0] == 'w' || params[0] == 's' || params[0] == 'p')
            {
                const unitsShort = params.shift();
                if (unitsShort == 's')
                {
                    options.units = 'sentences';
                }
                if (unitsShort == 'p')
                {
                    options.units = 'paragraphs';
                }
            }

            // Get counts
            if (params.length == 1)
            {
                max = parseInt(params[0], 10);
            }
            else if (params.length == 2)
            {
                min = parseInt(params[0], 10);
                max = parseInt(params[1], 10);
            }
        }
        options.count = useStaticContent
            ? max
            : min + ((max - min) * Math.random());

        // Go
        return Promise.resolve(uppercaseFirst(lorem(options)));
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ViewModelLipsumPlugin = ViewModelLipsumPlugin;
