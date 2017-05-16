'use strict';
describe('rocketvoip app', function () {

    it('should not redirect when token equls "Test-Token"', function() {
        var AuthenticationService = {
            Logout: jasmine.createSpy()
        };
        module('rocketvoip', function($provide) {
            $provide.value('$localStorage', {
                currentUser: {
                    token: "Test-Token"
                }
            });
            $provide.value('AuthenticationService',AuthenticationService);
        });

        inject(function (_AuthenticationService_) {
            AuthenticationService = _AuthenticationService_;
        });
        expect(AuthenticationService.Logout).toHaveBeenCalledTimes(0);
    });

    it('should redirect when token is expired', function() {
        var AuthenticationService = {
            Logout: jasmine.createSpy()
        };
        module('rocketvoip', function($provide) {
            $provide.value('$localStorage', {
                currentUser: {
                    token: "Test"
                }
            });
            $provide.value('AuthenticationService',AuthenticationService);
            $provide.value('jwtHelper',{
                isTokenExpired: jasmine.createSpy().and.returnValue(true)
            })
        });

        inject(function (_AuthenticationService_) {
            AuthenticationService = _AuthenticationService_;
        });
        expect(AuthenticationService.Logout).toHaveBeenCalledTimes(1);
    });

    it('should set $rootScope when token is valid', function() {
        var $timeout = jasmine.createSpy();
        module('rocketvoip', function($provide) {
            $provide.value('$localStorage', {
                currentUser: {
                    token: "Test"
                }
            });
            $provide.value('$timeout',$timeout);
            $provide.value('jwtHelper',{
                isTokenExpired: jasmine.createSpy().and.returnValue(false),
                getTokenExpirationDate: function () {
                    return new Date() + 5000;
                }
            })
        });

        inject(function (_$timeout_) {
            $timeout = _$timeout_;
        });
        expect($timeout).toHaveBeenCalled();
    });
});