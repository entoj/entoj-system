'use strict';

/**
 * Requirements
 */
const concat = require(ES_SOURCE + '/utils/pathes.js').concat;
const normalize = require(ES_SOURCE + '/utils/pathes.js').normalize;
const shift = require(ES_SOURCE + '/utils/pathes.js').shift;
const strip = require(ES_SOURCE + '/utils/pathes.js').strip;
const trimLeadingSlash = require(ES_SOURCE + '/utils/pathes.js').trimLeadingSlash;

/**
 * Spec
 */
describe('utils/pathes', function() {
    describe('#concat', function() {
        it('should add all given pathes into a valid full path', function() {
            const prefix = process.platform == 'win32' ? __dirname.substr(0, 3) : '/';
            expect(concat('start', 'with' + PATH_SEPERATOR, PATH_SEPERATOR + 'them')).to.be.equal(
                prefix + 'start' + PATH_SEPERATOR + 'with' + PATH_SEPERATOR + 'them'
            );
            expect(
                concat(PATH_SEPERATOR + 'start', '', PATH_SEPERATOR + 'them' + PATH_SEPERATOR)
            ).to.be.equal(prefix + 'start' + PATH_SEPERATOR + 'them');
        });

        it('should take care of different slash styles', function() {
            const prefix = process.platform == 'win32' ? __dirname.substr(0, 3) : '/';
            expect(concat('start', 'with/', '\\them')).to.be.equal(
                prefix + 'start' + PATH_SEPERATOR + 'with' + PATH_SEPERATOR + 'them'
            );
        });

        if (process.platform == 'win32') {
            it('should respect win32 drive names', function() {
                expect(concat('C:\\start', '/with', 'them')).to.be.equal('C:\\start\\with\\them');
                expect(
                    concat(
                        'C:\\Users\\IEUser\\Projects\\tk-relaunch\\sites',
                        '/base/css/common.css'
                    )
                ).to.be.equal(
                    'C:\\Users\\IEUser\\Projects\\tk-relaunch\\sites\\base\\css\\common.css'
                );
            });
        }
    });

    describe('#normalize', function() {
        it('should ignore leading slashes', function() {
            const prefix = process.platform == 'win32' ? __dirname.substr(0, 3) : '/';
            expect(normalize(PATH_SEPERATOR + 'start')).to.be.equal(prefix + 'start');
        });

        it('should return a absolute path', function() {
            const prefix = process.platform == 'win32' ? __dirname.substr(0, 3) : '/';
            expect(normalize('')).to.be.equal(prefix);
            expect(normalize('them')).to.be.equal(prefix + 'them');
            expect(normalize('them/')).to.be.equal(prefix + 'them');
            expect(normalize(PATH_SEPERATOR + 'them' + PATH_SEPERATOR)).to.be.equal(
                prefix + 'them'
            );
        });
    });

    describe('#trimLeadingSlash', function() {
        it('should remove trainling slashes', function() {
            expect(trimLeadingSlash('them')).to.be.equal('them');
            expect(trimLeadingSlash('/them')).to.be.equal('them');
            expect(trimLeadingSlash('\\them')).to.be.equal('them');
        });
    });

    describe('#shift', function() {
        it('should return a path minus the first directory', function() {
            const prefix = process.platform == 'win32' ? __dirname.substr(0, 3) : '/';
            expect(shift('them')).to.be.equal(prefix);
            expect(shift('them' + PATH_SEPERATOR + 'foos')).to.be.equal(prefix + 'foos');
        });
    });

    describe('#strip', function() {
        it('should return a path minus the given directories', function() {
            const prefix = process.platform == 'win32' ? __dirname.substr(0, 3) : '/';
            const testee = prefix + PATH_SEPERATOR + 'foo' + PATH_SEPERATOR + 'bar';
            expect(strip(testee, '/foo')).to.be.equal(prefix + PATH_SEPERATOR + 'bar');
        });
    });
});
