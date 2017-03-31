'use strict';

describe('rocketvoip.view_login module', function () {

    beforeEach(module('rocketvoip.view_login'));
    beforeEach(module('ngMaterial'));
    beforeEach(module('rocketvoip'));
    beforeEach(module('view_login/view_login.html'));

    describe('ViewLoginCtrl', function () {

        var scope, loginViewCtrl, AuthenticationService, mdToast, templateCache, compile, controller;

        function loadHTML() {
            var templateHtml = templateCache.get('view_login/view_login.html');
            var formElement = angular.element(templateHtml);
            // Doesn't include the outer div
            compile(formElement[0].innerHTML)(scope);
            scope.$apply();
        }

        beforeEach(inject(function ($rootScope, $controller, $mdToast, $compile, $templateCache) {
            AuthenticationService = {
                Login: jasmine.createSpy(),
                Logout: jasmine.createSpy()
            };
            scope = $rootScope.$new();
            loginViewCtrl = $controller("ViewLoginCtrl", {
                $scope: scope,
                AuthenticationService: AuthenticationService,
                $mdToast: $mdToast
            });
            mdToast = $mdToast;
            compile = $compile;
            templateCache = $templateCache;
            controller = $controller;
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

        it('should not do a POST call when username is empty', inject(function () {
            AuthenticationService.Login = jasmine.createSpy();
            loadHTML();
            scope.username = 'notAEmailAddress';
            scope.$apply();
            loginViewCtrl.login();
            scope.$apply();
            expect(AuthenticationService.Login).toHaveBeenCalledTimes(0);
        }));

        it('should  do a POST call when username and password are not empty', inject(function () {
            var auth = {
                Login: function () {
                },
                Logout: function () {
                }
            };
            spyOn(auth, 'Login').and.callFake(function (usr, pw, callback) {
                return callback(false);
            });
            loginViewCtrl = controller("ViewLoginCtrl", {
                $scope: scope,
                AuthenticationService: auth,
                UtilityService: {
                    showToast: function () {
                    }
                }
            });

            loadHTML();
            scope.username = 'test@test.ch';
            scope.password = '5698gfdk$--ggfds';
            spyOn(scope, 'showToast');
            scope.$apply();
            loginViewCtrl.login();
            scope.$apply();
            expect(auth.Login).toHaveBeenCalledTimes(1);
            expect(scope.showToast).toHaveBeenCalledTimes(1);

        }));

        it('should do a POST call when username and call lacation', inject(function ($location) {
            var auth = {
                Login: function () {
                },
                Logout: function () {
                }
            };
            spyOn(auth, 'Login').and.callFake(function (usr, pw, callback) {
                return callback(true);
            });
            loginViewCtrl = controller("ViewLoginCtrl", {
                $scope: scope,
                AuthenticationService: auth,
                UtilityService: {
                    showToast: function () {
                    }
                },
                $location: $location
            });

            loadHTML();
            scope.username = 'test@test.ch';
            scope.password = '5698gfdk$--ggfds';
            spyOn(scope, 'showToast');
            spyOn($location, 'path');

            scope.$apply();
            loginViewCtrl.login();
            scope.$apply();
            expect(auth.Login).toHaveBeenCalledTimes(1);
            expect(scope.showToast).toHaveBeenCalledTimes(0);
            expect($location.path).toHaveBeenCalledWith('/');

        }));

        it('should call Logout while loading controller', inject(function () {
            expect(AuthenticationService.Logout).toHaveBeenCalledTimes(1);
        }));

    });
});