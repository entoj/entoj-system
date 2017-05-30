
/**
 * @namespace nunjucks
 */
 module.exports =
 {
     Environment: require('./Environment.js').Environment,
     Template: require('./Template.js').Template,
     filter: require('./filter/index.js'),
     loader: require('./loader/index.js')
 };
