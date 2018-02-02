'use strict';

describe('rocketvoip.view_dialplan module', function () {

    beforeEach(module('rocketvoip.view_dialplans'));
    beforeEach(module('view_login/view_login.html'));
	beforeEach(module('view_dashboard/view_dashboard.html'));
    beforeEach(module('rocketvoip'));

    describe('view_dialplan controller', function () {
        var scope, viewDialplansCtrl, location, dialplanService, q, deferred, CompanyServiceMock,
            testCompanies, callbackNgResource, controller;

        beforeEach(inject(function ($rootScope, $controller, appConfig, DialplanService, $q) {
            testCompanies = [
                {id: 1, name: 'UnitTestAG'},
                {id: 5, name: 'CleanCode'}
            ];

            q = $q;
            deferred = $q.defer();
            location = {
                path: jasmine.createSpy().and.returnValue({search: jasmine.createSpy()}),
                search: jasmine.createSpy()
            };
            callbackNgResource = function (obj) {
                var ret = {};
                deferred.resolve(obj);
                ret.$promise = deferred.promise;
                return ret;
            };

            CompanyServiceMock = {
                query: function () {
                    return callbackNgResource(testCompanies);
                }
            };
            spyOn(CompanyServiceMock, 'query').and.callThrough();

            dialplanService = DialplanService;
            spyOn(dialplanService, 'query');
            scope = $rootScope.$new();
            controller = $controller;
            viewDialplansCtrl = $controller("ViewDialplansCtrl", {
                $scope: scope,
                appConfig: appConfig,
                $location: location,
                DialplanService: dialplanService,
                CompanyService: CompanyServiceMock
            });
        }));

        it('should be Defined', inject(function () {
            expect(viewDialplansCtrl).toBeDefined();
        }));

        it('should redirect to new Dialplan', inject(function () {
            scope.currentCompany = {
                id: 5,
                name: 'Test'
            };
            viewDialplansCtrl.showDialplan(null);
            expect(location.path).toHaveBeenCalledWith('/view_editDialplan/');
        }));

        it('should redirect to existing Dialplan', inject(function () {
            var dialplan = {
                id: 55
            };
            scope.currentCompany = {
                id: 5,
                name: 'Test'
            };
            viewDialplansCtrl.showDialplan(dialplan);
            expect(location.path).toHaveBeenCalledWith('/view_editDialplan/' + dialplan.id);
        }));

        it('should load Dialplans', inject(function () {
            viewDialplansCtrl.queryDialplans();
            expect(dialplanService.query).toHaveBeenCalledWith();
        }));

        it('should load Dialplans and query dialplans', inject(function () {
            spyOn(viewDialplansCtrl, 'queryDialplans');
            viewDialplansCtrl.queryCompanies();
            scope.$apply();
            expect(scope.companies.length).toEqual(testCompanies.length);
            expect(scope.currentCompany).toBeDefined();
            expect(viewDialplansCtrl.queryDialplans).toHaveBeenCalled();
        }));

        it('should load Dialplans and not query dialplans when there are no dialplans', inject(function () {
            deferred = q.defer();
            testCompanies = [];
            var ctrl = controller("ViewDialplansCtrl", {
                $scope: scope,
                $location: location,
                DialplanService: dialplanService,
                CompanyService: CompanyServiceMock
            });
            spyOn(ctrl, 'queryDialplans');
            ctrl.queryCompanies();
            scope.$apply();
            expect(scope.companies.length).toEqual(0);
            expect(ctrl.queryDialplans).toHaveBeenCalledTimes(0);
        }));
    });
});