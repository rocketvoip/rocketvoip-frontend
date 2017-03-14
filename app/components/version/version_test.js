'use strict';

describe('rocketvoip.version module', function () {
    beforeEach(module('rocketvoip.version'));

    describe('version service', function () {
        it('should return current version', inject(function (version) {
            expect(version).toEqual('0.1');
        }));
    });
});
