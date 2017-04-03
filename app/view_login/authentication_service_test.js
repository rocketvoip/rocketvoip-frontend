'use strict';

describe('rocketvoip.login module', function () {

    beforeEach(module('rocketvoip.login'));
    beforeEach(module('rocketvoip'));

    describe('AuthenticationService', function () {
        var http, q, deferred, service, url, httpBackend, scope;


        beforeEach(inject(function ($rootScope, $injector, $q, AuthenticationService, appConfig, $httpBackend) {
            scope = $rootScope.$new();
            q = $q;
            deferred = q.defer();
            service = AuthenticationService;
            url = appConfig.BACKEND_BASE_URL + appConfig.API_ENDPOINT + '/login';
            http = $injector.get('$http');
            httpBackend = $httpBackend;
        }));

        it('should be Defined', inject(function () {
            expect(service).toBeDefined();
        }));

        it('should export Login function', inject(function () {
            expect(service.Login).toBeDefined();
        }));

        it('should export Logout function', inject(function () {
            expect(service.Logout).toBeDefined();
        }));

        it('should clear Authorization on Logout', inject(function () {
            http.defaults.headers.common['X-Auth-Token'] = "------";
            service.Logout();
            expect(http.defaults.headers.common['X-Auth-Token']).toEqual('');
        }));

        it('should call callback with Auth failed message', inject(function () {
            httpBackend.when('POST', /login/).respond(200);
            var callback = jasmine.createSpy();
            service.Login({}, {}, callback);
            httpBackend.flush();
            expect(callback).toHaveBeenCalledWith("Email Address or password is incorrect");
        }));

        it('should call callback after HTTP 404 Status', inject(function () {
            httpBackend.when('POST', /login/).respond(404)
            var callback = jasmine.createSpy();
            service.Login({}, {}, callback);
            httpBackend.flush();
            expect(callback).toHaveBeenCalledWith("Could not reach the server...");
        }));

        it('should call callback after successful authentication', inject(function () {
            httpBackend.when('POST', /login/).respond(200, {}, {'X-Auth-Token': 'Test-Token'});
            var callback = jasmine.createSpy();
            service.Login({}, {}, callback);
            httpBackend.flush();
            expect(callback).toHaveBeenCalledWith(true);
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });
    });
});