
/**
 * @namespace model
 */
module.exports =
{
    Loader: require('./Loader.js').Loader,
    Repository: require('./Repository.js').Repository,
    ValueObject: require('./ValueObject.js').ValueObject,
    DocumentableValueObject: require('./DocumentableValueObject.js').DocumentableValueObject,
    ContentKind: require('./ContentKind.js').ContentKind,
    ContentType: require('./ContentType.js').ContentType,
    GlobalRepository: require('./GlobalRepository.js').GlobalRepository,
    configuration: require('./configuration/index.js'),
    content: require('./content/index.js'),
    documentation: require('./documentation/index.js'),
    entity: require('./entity/index.js'),
    file: require('./file/index.js'),
    loader: require('./loader/index.js'),
    setting: require('./setting/index.js'),
    site: require('./site/index.js'),
    translation: require('./translation/index.js'),
    viewmodel: require('./viewmodel/index.js')
};
