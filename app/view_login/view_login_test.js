'use strict';

describe('rocketvoip.view_login module', function () {

    beforeEach(module('rocketvoip.view_login'));
    beforeEach(module('ngMaterial'));
    beforeEach(module('rocketvoip'));

    describe('ViewLoginCtrl', function () {

        var scope, loginViewCtrl, AuthenticationService,mdToast;



        beforeEach(inject(function ($rootScope, $controller,$mdToast) {
            AuthenticationService = {
                Login: jasmine.createSpy(),
                Logout: jasmine.createSpy()
            };
            scope = $rootScope.$new();
            loginViewCtrl = $controller("ViewLoginCtrl", {
                $scope: scope,
                AuthenticationService : AuthenticationService,
                $mdToast: $mdToast
            });
            mdToast = $mdToast;
        }));

        it('should be Defined', inject(function () {
            expect(loginViewCtrl).toBeDefined();
        }));

        it('should have a function login', inject(function () {
            expect(loginViewCtrl.login).toBeDefined();
        }));

        it('should call Logout while initializing the controller', inject(function () {
            expect(AuthenticationService.Logout).toHaveBeenCalledTimes(1);
        }));

        it('should show Toast when error', inject(function () {
            mdToast.show = jasmine.createSpy();
            scope.showToast();
            expect(mdToast.show).toHaveBeenCalledTimes(1);
        }));


    });
});