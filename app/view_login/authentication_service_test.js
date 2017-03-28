'use strict';

describe('rocketvoip.login module', function () {

    beforeEach(module('rocketvoip.login'));
    beforeEach(module('rocketvoip'));

    describe('AuthenticationService', function () {
        var http, q, deferred, service, url, httpBackend,scope;


        beforeEach(inject(function ($rootScope,$injector,$q,AuthenticationService,appConfig,$httpBackend) {
            scope = $rootScope.$new();
            q = $q;
            deferred = q.defer();
            service = AuthenticationService;
            url = appConfig.BACKEND_BASE_URL + appConfig.API_ENDPOINT + '/login';

            http = $injector.get('$http');

            http.post = function(){
                var respone = {};
                respone.token = "Test-Token";
                deferred.resolve(respone);
                return deferred.promise;
            };

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
            http.defaults.headers.common.Authorization = "------";
            service.Logout();
            expect(http.defaults.headers.common.Authorization).toEqual('');
        }));

        it('should call callback after POST Request', inject(function () {
            httpBackend.when('POST', /login/).respond(200, { data: 'value' });
            var callback = jasmine.createSpy();
            service.Login({},{},callback);
            scope.$apply();
            expect(callback).toHaveBeenCalledWith(true);
        }));

        it('should call callback after POST Request', inject(function () {
            httpBackend.when('POST', /login/).respond(400, {});
            var callback = jasmine.createSpy();
            service.Login({},{},callback);
            scope.$apply();

            //expect(callback).toHaveBeenCalledWith(tr);
        }));
    });
});