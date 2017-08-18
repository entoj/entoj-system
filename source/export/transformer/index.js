
/**
 * @namespace export.transformer
 */
module.exports =
{
    DecorateVariableNameTransformer: require('./DecorateVariableNameTransformer.js').DecorateVariableNameTransformer,
    InlineMacroCallTransformer: require('./InlineMacroCallTransformer.js').InlineMacroCallTransformer,
    MapParametersTransformer: require('./MapParametersTransformer.js').MapParametersTransformer,
    NodeTransformer: require('./NodeTransformer.js').NodeTransformer,
    PreferYieldTransformer: require('./PreferYieldTransformer.js').PreferYieldTransformer,
    RemoveLoadModelTransformer: require('./RemoveLoadModelTransformer.js').RemoveLoadModelTransformer,
    RemoveYieldTransformer: require('./RemoveYieldTransformer.js').RemoveYieldTransformer
};
