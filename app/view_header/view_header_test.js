'use strict';

describe('rocketvoip.view_login module', function () {

    beforeEach(module('rocketvoip.view_header'));

    describe('HeaderCtrl', function () {

        var headerCtrl, scope;

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            headerCtrl = $controller("HeaderCtrl", {
                $scope: scope,
                AuthenticationService: {
                    Logout: jasmine.createSpy()
                },
                $localStorage: null
            });
        }));

        it('should be Defined', inject(function () {
            expect(headerCtrl).toBeDefined();
        }));

        it('should define function logout in scope', inject(function () {
            expect(scope.logout).toBeDefined();
        }));
    });
});