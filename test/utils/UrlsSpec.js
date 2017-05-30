'use strict';

/**
 * Requirements
 */
const urlify = require(ES_SOURCE + '/utils/urls.js').urlify;
const normalizePathSeparators = require(ES_SOURCE + '/utils/urls.js').normalizePathSeparators;
const normalize = require(ES_SOURCE + '/utils/urls.js').normalize;
const trimLeadingSlash = require(ES_SOURCE + '/utils/urls.js').trimLeadingSlash;
const shift = require(ES_SOURCE + '/utils/urls.js').shift;


/**
 * Spec
 */
describe('utils/urls', function()
{
    describe('#urlify', function()
    {
        it('should replace any spaces with dashes', function()
        {
            expect(urlify('this is sparta')).to.be.equal('this-is-sparta');
        });

        it('should allow to configure the replacement for spaces', function()
        {
            expect(urlify('this is sparta', '_')).to.be.equal('this_is_sparta');
        });

        it('should lowercase all characters', function()
        {
            expect(urlify('ThisIsSparta')).to.be.equal('thisissparta');
        });

        it('should replace any non ascii characters with a ascii counter part', function()
        {
            expect(urlify('Ödipußi')).to.be.equal('odipussi');
        });
    });


    describe('#normalizePathSeparators', function()
    {
        it('should convert all slashes', function()
        {
            expect(normalizePathSeparators('/start\\where')).to.be.equal('/start/where');
        });
    });


    describe('#trimLeadingSlash', function()
    {
        it('should remove leading slashes', function()
        {
            expect(trimLeadingSlash('/start/where')).to.be.equal('start/where');
        });
    });


    describe('#normalize', function()
    {
        it('should ensure leading slashes', function()
        {
            expect(normalize('start')).to.be.equal('/start');
        });

        it('should remove trailing slashes', function()
        {
            expect(normalize('start/')).to.be.equal('/start');
        });

        it('should convert all slashes', function()
        {
            expect(normalize('/start\\where')).to.be.equal('/start/where');
        });
    });


    describe('#shift', function()
    {
        it('should remove the first path segment', function()
        {
            expect(shift('/start/where')).to.be.equal('/where');
        });
    });
});
