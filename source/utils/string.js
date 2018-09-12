'use strict';

/**
 * Requirements
 * @ignore
 */
const merge = require('lodash.merge');
const XRegExp = require('xregexp');

/**
 * Trims a multiline string
 *
 * @memberOf utils.string
 * @param {String} content
 */
function trimMultiline(content, skipSections) {
    if (!content || typeof content !== 'string') {
        return '';
    }
    const lines = content.replace(/\t/g, '    ').split('\n');
    let sectionStarted = false;
    const resultLines = lines.map(function(line) {
        let result = line.trim();
        if (!sectionStarted) {
            if (skipSections) {
                for (const skip of skipSections) {
                    if (skip.start == result) {
                        sectionStarted = true;
                    }
                }
            }
        } else {
            for (const skip of skipSections) {
                if (skip.end == result) {
                    sectionStarted = false;
                }
            }
            if (sectionStarted) {
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
 * @memberOf utils.string
 * @param {String} content
 */
function shortenMiddle(content, length) {
    if (!content || typeof content !== 'string') {
        return '';
    }
    let maxLength = length || 100;
    if (content.length < maxLength) {
        return content;
    }
    if (maxLength < 2) {
        return content.substr(0, maxLength);
    }

    maxLength -= 1;
    const remove = Math.max(0, content.length - maxLength);
    const start = Math.round((content.length - remove) / 2);

    return content.substr(0, start) + '…' + content.substr(start + remove);
}

/**
 * Shortens a string
 *
 * @memberOf utils.string
 * @param {String} content
 */
function shortenLeft(content, length) {
    if (!content || typeof content !== 'string') {
        return '';
    }
    const maxLength = length || 100;
    if (content.length < maxLength) {
        return content;
    }
    if (maxLength < 2) {
        return content.substr(-maxLength, maxLength);
    }
    return '…' + content.substr(-1 * (maxLength - 1), maxLength - 1);
}

/**
 * Uppercases the frist character of a string
 *
 * @memberOf utils.string
 * @param {String} content
 */
function uppercaseFirst(content) {
    if (typeof content !== 'string') {
        return '';
    }
    return content.charAt(0).toUpperCase() + content.substr(1);
}

/**
 * Uppercases the frist character of a string
 *
 * @memberOf utils.string
 * @param {String} content
 * @param {String} environment
 */
function activateEnvironment(content, environment) {
    const doActivateEnvironment = function(content, environment, open, close) {
        let result = '';
        const openRegex = new RegExp(open, 'mi');
        const matches = XRegExp.matchRecursive(content, open, close, 'gmi', {
            valueNames: ['between', 'left', 'match', 'right']
        });
        let environments = [];
        let body = '';
        for (const match of matches) {
            switch (match.name) {
                case 'between':
                    result += match.value;
                    break;

                case 'left':
                    const environmentMatches = openRegex.exec(match.value);
                    if (environmentMatches && environmentMatches.length) {
                        environments = environmentMatches[1].split(',').map((item) => item.trim());
                    } else {
                        environments = [];
                    }
                    break;

                case 'match':
                    body += match.value;
                    break;

                case 'right':
                    let keep = false;
                    for (const requiredEnvironment of environments) {
                        if (requiredEnvironment.startsWith('!')) {
                            if (requiredEnvironment.substr(1) != environment) {
                                keep = true;
                            }
                        } else {
                            if (requiredEnvironment == environment) {
                                keep = true;
                            }
                        }
                    }
                    if (keep) {
                        result += doActivateEnvironment(body, environment, open, close);
                    }
                    body = '';
                    break;
            }
        }
        return result;
    };

    let result = content;
    result = doActivateEnvironment(
        result,
        environment,
        '<!--\\s+\\+environment:\\s+([\\w\\s!,-]+)\\s*-->',
        '<!--\\s+\\-environment\\s*-->'
    );
    result = doActivateEnvironment(
        result,
        environment,
        '\\{#\\s+\\+environment:\\s+([\\w\\s!,-]+)\\s*#\\}',
        '\\{#\\s+\\-environment\\s*#\\}'
    );
    result = doActivateEnvironment(
        result,
        environment,
        '\\/\\*\\s*\\s+\\+environment:\\s+([\\w\\s!,-]+)\\s*\\*\\/',
        '\\/\\*\\s*\\s+\\-environment\\s*\\*\\/'
    );
    return result;
}

/**
 * Trims any slashes from the left side of a stirng
 *
 * @memberOf utils.string
 * @param {String} value
 */
function trimSlashesLeft(value) {
    if (!value || typeof value !== 'string') {
        return '';
    }
    let result = value;
    while (result.startsWith('/') || result.startsWith('\\')) {
        result = result.substr(1);
    }
    return result;
}

/**
 * Trims any single ot double quotes from both sides of a string
 *
 * @memberOf utils.string
 * @param {String} value
 */
function trimQuotes(value) {
    if (!value || typeof value !== 'string') {
        return '';
    }
    return value.replace(/^['"]+|['"]+$/g, '');
}

/**
 * Adds <p> around paragraphs and add some inline
 * tags to that paragraphs.
 *
 * @memberOf utils.string
 * @param {String} value
 * @param {Object} [options]
 */
function htmlify(value, options) {
    if (!value || typeof value !== 'string') {
        return '';
    }

    // Default config
    const defaults = {
        random: Math.random,
        wordsPerTag: 10,
        maxTagOffset: 3,
        minWordsBetweenTags: 1,
        minWordsInTag: 1,
        maxWordsInTag: 3
    };

    // Merge custom options with default
    const opts = merge({}, defaults, options || {});
    if (!opts.tags) {
        opts.tags = [
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
            },
            {
                name: 'h1',
                probability: 0.1
            },
            {
                name: ['h2', 'h3', 'h4', 'h5', 'em'],
                probability: 0.2
            }
        ];
    }

    // Get paragraphs
    const paragraphs = value.split(/\n+/);

    // Generate tags
    let result = '';
    for (const paragraph of paragraphs) {
        // Count words and get a max tag count
        const words = paragraph.split(/\s+/);
        const tagCount = Math.floor(
            (words.length + opts.minWordsBetweenTags) /
                (opts.wordsPerTag + opts.minWordsBetweenTags)
        );

        // Add tags
        let addedTags = 0;
        for (let tagId = 0; tagId < tagCount; tagId++) {
            // Determine which tag is used in a somewhat randomn fashion
            let tagValue = opts.random();

            // Make sure we always have at least one tag
            if (addedTags < 1 && tagId == tagCount - 1) {
                tagValue = 1;
            }
            const tags = opts.tags.filter((tag) => tag.probability + tagValue >= 1);
            const tagIndex = Math.round((tags.length - 1) * opts.random());
            const tag = tags[tagIndex];

            // Add a tag if necessary
            if (tag) {
                // Get start and end index so that they don't overlap
                const startIndex = Math.round(
                    tagId * opts.wordsPerTag +
                        opts.random() * opts.maxTagOffset +
                        tagId * opts.minWordsBetweenTags
                );
                const endIndex =
                    Math.round(
                        startIndex +
                            opts.minWordsInTag +
                            (opts.maxWordsInTag - opts.minWordsInTag) * opts.random()
                    ) - 1;

                // Prepare attributes
                let attributes = '';
                if (tag.attributes) {
                    for (const attributeName in tag.attributes) {
                        attributes +=
                            ' ' + attributeName + '="' + tag.attributes[attributeName] + '"';
                    }
                }

                // Add to words
                const tagName = Array.isArray(tag.name)
                    ? tag.name[Math.round((tag.name.length - 1) * opts.random())]
                    : tag.name;
                words[startIndex] = '<' + tagName + attributes + '>' + words[startIndex];
                words[endIndex] = words[endIndex] + '</' + tagName + '>';

                // We got one
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
module.exports.trimQuotes = trimQuotes;
module.exports.htmlify = htmlify;
