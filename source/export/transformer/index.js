
/**
 * @namespace export.transformer
 */
module.exports =
{
    DecorateVariableNameTransformer: require('./DecorateVariableNameTransformer.js').DecorateVariableNameTransformer,
    InlineMacroCallTransformer: require('./InlineMacroCallTransformer.js').InlineMacroCallTransformer,
    NodeTransformer: require('./NodeTransformer.js').NodeTransformer,
    RemoveLoadModelTransformer: require('./RemoveLoadModelTransformer.js').RemoveLoadModelTransformer
};
