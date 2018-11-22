
/**
 * @namespace nunjucks
 */
module.exports =
{
    Environment: require('./Environment.js').Environment,
    Template: require('./Template.js').Template,
    filter: require('./filter/index.js'),
    helper: require('./helper/index.js'),
    loader: require('./loader/index.js'),
    tag: require('./tag/index.js')
};
