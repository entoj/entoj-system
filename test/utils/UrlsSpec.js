'use strict';

/**
 * Requirements
 */
const urlify = require(ES_SOURCE + '/utils/urls.js').urlify;
const normalizePathSeparators = require(ES_SOURCE + '/utils/urls.js').normalizePathSeparators;
const normalize = require(ES_SOURCE + '/utils/urls.js').normalize;
const trimLeadingSlash = require(ES_SOURCE + '/utils/urls.js').trimLeadingSlash;
const shift = require(ES_SOURCE + '/utils/urls.js').shift;
const concat = require(ES_SOURCE + '/utils/urls.js').concat;
const trimTrailingSlash = require(ES_SOURCE + '/utils/urls.js').trimTrailingSlash;
const ensureTrailingSlash = require(ES_SOURCE + '/utils/urls.js').ensureTrailingSlash;

/**
 * Spec
 */
describe('utils/urls', function() {
    describe('#urlify', function() {
        it('should replace any spaces with dashes', function() {
            expect(urlify('this is sparta')).to.be.equal('this-is-sparta');
        });

        it('should allow to configure the replacement for spaces', function() {
            expect(urlify('this is sparta', '_')).to.be.equal('this_is_sparta');
        });

        it('should lowercase all characters', function() {
            expect(urlify('ThisIsSparta')).to.be.equal('thisissparta');
        });

        it('should replace any non ascii characters with a ascii counter part', function() {
            expect(urlify('Ödipußi')).to.be.equal('odipussi');
        });
    });

    describe('#normalizePathSeparators', function() {
        it('should convert all slashes', function() {
            expect(normalizePathSeparators('/start\\where')).to.be.equal('/start/where');
        });
    });

    describe('#trimLeadingSlash', function() {
        it('should remove leading slashes', function() {
            expect(trimLeadingSlash('/start/where')).to.be.equal('start/where');
        });
    });

    describe('#trimTrailingSlash', function() {
        it('should remove trailing slashes', function() {
            expect(trimTrailingSlash('/start/where/')).to.be.equal('/start/where');
        });
    });

    describe('#normalize', function() {
        it('should ensure leading slashes', function() {
            expect(normalize('start')).to.be.equal('/start');
        });

        it('should remove trailing slashes', function() {
            expect(normalize('start/')).to.be.equal('/start');
        });

        it('should convert all slashes', function() {
            expect(normalize('/start\\where')).to.be.equal('/start/where');
        });
    });

    describe('#concat', function() {
        it('should ensure leading slashes', function() {
            expect(concat('start')).to.be.equal('/start');
        });

        it('should remove trailing slashes', function() {
            expect(concat('start/', 'to', '/finish')).to.be.equal('/start/to/finish');
        });

        it('should convert all slashes', function() {
            expect(concat('/start\\to', 'the', 'finish/')).to.be.equal('/start/to/the/finish');
        });
    });

    describe('#shift', function() {
        it('should remove the first path segment', function() {
            expect(shift('/start/where')).to.be.equal('/where');
        });
    });

    describe('#ensureTrailingSlash', function() {
        it('should add a trailing slash when missing', function() {
            expect(ensureTrailingSlash('/start/where')).to.be.equal('/start/where/');
            expect(ensureTrailingSlash('/start/where/')).to.be.equal('/start/where/');
        });
    });
});
