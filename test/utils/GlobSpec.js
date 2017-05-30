'use strict';

/**
 * Requirements
 */
const glob = require(ES_SOURCE + '/utils/glob.js');
const PATH_SEPERATOR = require('path').sep;

/**
 * Spec
 */
describe('utils/glob', function()
{
    /**
     * FileParser Test
     */
    beforeEach(function()
    {
        global.fixtures =
        {
            root: ES_FIXTURES + PATH_SEPERATOR + 'files'
        };
    });


    describe('#glob', function()
    {
        it('should return a promise', function()
        {
            const pathes = global.fixtures.root + PATH_SEPERATOR + 'mixed' + PATH_SEPERATOR + '*.j2';
            expect(glob(pathes)).to.be.instanceof(Promise);
        });

        it('should glob all files in a single directory', function(cb)
        {
            const path = global.fixtures.root + PATH_SEPERATOR + 'mixed';
            const pathes = path + PATH_SEPERATOR + '*.j2';
            glob(pathes).then((files) =>
            {
                expect(files).to.have.length(1);
                expect(files).to.contain(path + PATH_SEPERATOR + 'mixed-j2-01.j2');
                cb();
            })
            .catch((e) =>
            {
                cb(e);
            });
        });

        it('should glob all files in multiple directories', function(cb)
        {
            const path = global.fixtures.root;
            const pathes = [path + PATH_SEPERATOR + 'j2' + PATH_SEPERATOR + '*.j2',
                path + PATH_SEPERATOR + 'mixed' + PATH_SEPERATOR + '*.j2'];
            glob(pathes).then((files) =>
            {
                expect(files).to.have.length(2);
                expect(files).to.contain(path + PATH_SEPERATOR + 'j2' + PATH_SEPERATOR + 'j2-01.j2');
                expect(files).to.contain(path + PATH_SEPERATOR + 'mixed' + PATH_SEPERATOR + 'mixed-j2-01.j2');
                cb();
            })
            .catch((e) =>
            {
                cb(e);
            });
        });
    });
});
