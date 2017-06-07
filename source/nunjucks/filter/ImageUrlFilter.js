'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;


/**
 * Generates a image url.
 * There are two ways to specify image dimensions:
 *   - Use an acpect ratio and width e.g. image|imageUlr('1x1', 500)
 *   - Use width or/and height and a optional force parameter e.g. image|imageUrl(500, 0, true).
 *     If force is true the image will be forced into the given dimensions - otherwise it will
 *     be resized to best fit.
 *
 * @memberOf nunjucks.filter
 */
class ImageUrlFilter extends Filter
{
    /**
     * @inheritDocs
     */
    constructor()
    {
        super();
        this._name = 'imageUrl';
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'nunjucks.filter/ImageUrlFilter';
    }


    /**
     * @inheritDocs
     */
    filter()
    {
        return function(value, width, height, force)
        {
            // Get image name
            const id = value ? value : '*.png';

            // Just serve if no valid sizing
            if ((!width && !height) ||
                (typeof width === 'string' && !height))
            {
                return '/images/' + id;
            }

            // Just serve svg's
            if (id.endsWith('.svg'))
            {
                return '/images/' + id;
            }

            // Handle sizing
            let w = width || 0;
            let h = height || 0;
            let f = (force === true) ? 1 : 0;

            // aspect + width
            if (typeof width === 'string')
            {
                const aspectParts = width.split('x');
                const aspectRatio = parseInt(aspectParts[1]) / parseInt(aspectParts[0]);
                w = height;
                h = w * aspectRatio;
                f = 1;
            }

            // Done
            return '/images/' + id + '/' + w + '/' + h + '/' + f;
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ImageUrlFilter = ImageUrlFilter;
