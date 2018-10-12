/**
 * @namespace nunjucks
 */
module.exports = {
    Environment: require('./Environment.js').Environment,
    Template: require('./Template.js').Template,
    TemplateRenderer: require('./TemplateRenderer.js').TemplateRenderer,
    filter: require('./filter/index.js'),
    loader: require('./loader/index.js'),
    tag: require('./tag/index.js')
};
