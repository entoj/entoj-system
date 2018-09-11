/**
 * @namespace linter
 */
module.exports = {
    Linter: require('./Linter.js').Linter,
    FileLinter: require('./FileLinter.js').FileLinter,
    NunjucksLinter: require('./NunjucksLinter.js').NunjucksLinter,
    NunjucksFileLinter: require('./NunjucksFileLinter.js').NunjucksFileLinter
};
