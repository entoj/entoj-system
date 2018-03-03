'use strict';

/**
 * Requirements
 */
const LinterResult = require(ES_SOURCE + '/model/linter/LinterResult.js').LinterResult;
const ContentType = require(ES_SOURCE + '/model/ContentType.js').ContentType;
const ContentKind = require(ES_SOURCE + '/model/ContentKind.js').ContentKind;
const Site = require(ES_SOURCE + '/model/site/Site.js').Site;
const PATH_SEPERATOR = require('path').sep;
const isWin32 = (process.platform == 'win32');
const baseSpec = require('../../BaseShared.js').spec;
const valueObjectSpec = require('../ValueObjectShared.js').spec;


/**
 * Spec
 */
describe(LinterResult.className, function()
{
    /**
     * Base Test
     */
    valueObjectSpec(LinterResult, 'model.linter/LinterResult');


    /**
     * LinterResult Test
     */

    // Simple properties
    baseSpec.assertProperty(new LinterResult(), ['linter'], 'TestLinter', '');
    baseSpec.assertProperty(new LinterResult(), ['contentType'], ContentType.SASS, ContentType.ANY);
    baseSpec.assertProperty(new LinterResult(), ['contentKind'], ContentKind.CSS, ContentKind.UNKOWN);
    baseSpec.assertProperty(new LinterResult(), ['success'], true, false);
    baseSpec.assertProperty(new LinterResult(), ['warningCount'], 10, 0);
    baseSpec.assertProperty(new LinterResult(), ['errorCount'], 5, 0);
    baseSpec.assertProperty(new LinterResult(), ['messages'], [{}], []);
});
