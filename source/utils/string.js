'use strict';

/**
 * Requirements
 * @ignore
 */
const merge = require('lodash.merge');


/**
 * Trims a multiline string
 *
 * @memberOf utils
 * @param {String} content
 */
function trimMultiline(content, skipSections)
{
    if (!content || typeof content !== 'string')
    {
        return '';
    }
    const lines = content.replace(/\t/g, '    ').split('\n');
    let sectionStarted = false;
    const resultLines = lines.map(function(line)
    {
        let result = line.trim();
        if (!sectionStarted)
        {
            if (skipSections)
            {
                for (const skip of skipSections)
                {
                    if (skip.start == result)
                    {
                        sectionStarted = true;
                    }
                }
            }
        }
        else
        {
            for (const skip of skipSections)
            {
                if (skip.end == result)
                {
                    sectionStarted = false;
                }
            }
            if (sectionStarted)
            {
                result = line;
            }
        }
        return result;
    });
    return resultLines.join('\n');
}


/**
 * Shortens a string
 *
 * @memberOf utils
 * @param {String} content
 */
function shortenMiddle(content, length)
{
    if (!content || typeof content !== 'string')
    {
        return '';
    }
    let maxLength = length || 100;
    if (content.length < maxLength)
    {
        return content;
    }
    if (maxLength < 2)
    {
        return content.substr(0, maxLength);
    }

    maxLength-= 1;
    const remove = Math.max(0, (content.length - maxLength));
    const start = Math.round((content.length - remove) / 2);

    return content.substr(0, start) + '…' + content.substr(start + remove);
}


/**
 * Shortens a string
 *
 * @memberOf utils
 * @param {String} content
 */
function shortenLeft(content, length)
{
    if (!content || typeof content !== 'string')
    {
        return '';
    }
    const maxLength = length || 100;
    if (content.length < maxLength)
    {
        return content;
    }
    if (maxLength < 2)
    {
        return content.substr(-maxLength, maxLength);
    }
    return '…' + content.substr(-1 * (maxLength - 1), maxLength - 1);
}


/**
 * Uppercases the frist character of a string
 *
 * @memberOf utils
 * @param {String} content
 */
function uppercaseFirst(content)
{
    return content.charAt(0).toUpperCase() + content.substr(1);
}


/**
 * Uppercases the frist character of a string
 *
 * @memberOf utils
 * @param {String} content
 * @param {String} environment
 */
function activateEnvironment(content, environment)
{
    const typeDefault = function(environment)
    {
        return new RegExp('\\/\\*\\s*\\+environment\\s*:\\s*' + environment + '\\s*\\*\\/([\\s\\S]*?)\\/\\*\\s+\\-environment\\s\\*\\/', 'igm');
    };

    const typeJinja = function(environment)
    {
        return new RegExp('\\{#\\s*\\+environment\\s*:\\s*' + environment + '\\s*#\\}([\\s\\S]*?)\\{#\\s+\\-environment\\s#\\}', 'igm');
    };

    const typeHtml = function(environment)
    {
        return new RegExp('<!--\\s+\\+environment:\\s+' + environment + '\\s*-->([\\s\\S]*?)<!--\\s+\\-environment\\s-->', 'igm');
    };

    let result = content;
    const placeholder = '([\\!\\w]+)';
    const types =
    [
        typeDefault,
        typeJinja,
        typeHtml
    ];
    const environmentRegex = types.map((create) => create(environment));
    const removeRegex = types.map((create) => create(placeholder));

    if (environment)
    {
        // Replace direct matches
        for (const regex of environmentRegex)
        {
            result = result.replace(regex, '$1');
        }
        // Replace negated matches
        for (const type of types)
        {
            const findRegex = type(placeholder);
            let match;
            while ((match = findRegex.exec(result)) !== null)
            {
                if (match[1].startsWith('!'))
                {
                    const env = match[1].substring(1);
                    if (env !== environment)
                    {
                        const activateRegex = type('\\!' + env);
                        result = result.replace(activateRegex, '$1');
                    }
                }
            }
        }
    }
    for (const regex of removeRegex)
    {
        result = result.replace(regex, '');
    }
    return result;
}


/**
 * Trims any slashes from the left side of a stirng
 *
 * @memberOf utils
 * @param {String} value
 */
function trimSlashesLeft(value)
{
    if (!value || typeof value !== 'string')
    {
        return '';
    }
    let result = value;
    while(result.startsWith('/') || result.startsWith('\\'))
    {
        result = result.substr(1);
    }
    return result;
}

/**
 */
function htmlify(value, options)
{
    if (!value || typeof value !== 'string')
    {
        return '';
    }

    // Default config
    const defaults =
    {
        wordsPerTag: 10,
        maxTagOffset: 3,
        minWordsBetweenTags: 1,
        minWordsInTag: 1,
        maxWordsInTag: 3
    };

    // Merge custom options with default
    const opts = merge({}, defaults, options || {});
    if (!opts.tags)
    {
        opts.tags =
        [
            {
                name: 'a',
                probability: 0.2,
                attributes:
                {
                    href: 'JavaScript:;'
                }
            },
            {
                name: ['sub', 'sup'],
                probability: 0.2
            },
            {
                name: 'h1',
                probability: 0.3
            },
            {
                name: ['h2', 'h3', 'h4', 'h5', 'em'],
                probability: 0.4
            }
        ];
    }

    // Get paragraphs
    const paragraphs = value.split(/\n+/);

    // Generate tags
    let result = '';
    for (const paragraph of paragraphs)
    {
        // Count words an get a max tag count
        const words = paragraph.split(/\s+/);
        const tagCount = Math.floor((words.length + opts.minWordsBetweenTags) / (opts.wordsPerTag + opts.minWordsBetweenTags));

        // Add tags
        let addedTags = 0;
        for (let tagId = 0; tagId < tagCount; tagId++)
        {
            // Determine which tag is used in a somewhat randomn fashion
            let tagValue = Math.random();
            // Make sure we always have at least one tag
            if (addedTags < 1 && tagId == tagCount - 1)
            {
                tagValue = 1;
            }
            const tags = opts.tags.filter((tag) => tag.probability + tagValue >= 1);
            const tagIndex = Math.round((tags.length - 1) * Math.random());
            const tag = tags[tagIndex];

            // Add a tag if necessary
            if (tag)
            {
                // Get start and end index so that they don't overlap
                const startIndex = Math.round(tagId * opts.wordsPerTag
                    + (Math.random() * opts.maxTagOffset)
                    + (tagId * opts.minWordsBetweenTags));
                const endIndex = Math.round(startIndex
                    + opts.minWordsInTag
                    + ((opts.maxWordsInTag - opts.minWordsInTag) * Math.random()))
                    - 1;

                // Prepare attributes
                let attributes = '';
                if (tag.attributes)
                {
                    for (const attributeName in tag.attributes)
                    {
                        attributes += ' ' + attributeName + '="' + tag.attributes[attributeName] + '"';
                    }
                }

                // Add to words
                const tagName = Array.isArray(tag.name)
                    ? tag.name[Math.round((tag.name.length - 1) * Math.random())]
                    : tag.name;
                words[startIndex] = '<' + tagName + attributes + '>' + words[startIndex];
                words[endIndex] = words[endIndex] + '</' + tagName + '>';

                // We got one, coach
                addedTags++;
            }
        }
        result += '<p>' + words.join(' ').trim() + '</p>\n';
    }

    return result;
}


/**
 * Exports
 * @ignore
 */
module.exports.trimMultiline = trimMultiline;
module.exports.shortenMiddle = shortenMiddle;
module.exports.shortenLeft = shortenLeft;
module.exports.uppercaseFirst = uppercaseFirst;
module.exports.activateEnvironment = activateEnvironment;
module.exports.trimSlashesLeft = trimSlashesLeft;
module.exports.htmlify = htmlify;
