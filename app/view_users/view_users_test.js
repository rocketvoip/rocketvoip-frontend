'use strict';

describe('rocketvoip.view_users module', function () {

    beforeEach(angular.mock.module('rocketvoip.view_users'));
    beforeEach(module('ngMaterial'));
    beforeEach(module('rocketvoip.panel_editUser'));
    beforeEach(module('view_users/panel_editUser.html'));
    beforeEach(module('rocketvoip'));

    describe('view_users controller', function () {

        var scope;
        var rootScope;
        var viewUserCtrl;
        var testSipClients;
        var mdPanel;
        var SipClientServiceMock;
        var controller;
        var CompanyServiceMock;
        var q;
        var deferred;
        var testCompanies;
        var callbackNgResource;

        beforeEach(inject(function ($rootScope, $controller, $mdPanel, appConfig, $q) {
            q = $q;
            deferred = $q.defer();

            testSipClients = [
                {id: 1, name: 'Marco Studerus', phone: "+41223334455"},
                {id: 2, name: 'Martin Wittwer', phone: "+41223334455"},
                {id: 3, name: 'Jona Braun', phone: "+41223334455"},
                {id: 4, name: 'Hans Peter', phone: "+41223334455"}];

            testCompanies = [
                {id: 1, name: 'UnitTestAG'},
                {id: 5, name: 'CleanCode'}
            ];

            mdPanel = $mdPanel;
            scope = $rootScope.$new();
            rootScope = $rootScope;
            controller = $controller;
            SipClientServiceMock = {
                query: function () {
                    return testSipClients;
                }
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
            viewUserCtrl = $controller("ViewUsersCtrl", {
                $scope: scope,
                $mdPanel: $mdPanel,
                appConfig: appConfig,
                SipClientService: SipClientServiceMock,
                CompanyService: CompanyServiceMock
            });

        }));

        it('should be Defined', inject(function () {
            expect(viewUserCtrl).toBeDefined();
        }));

        if ('should call SipClientService to query clients', inject(function () {
                spyOn(SipClientServiceMock, 'query');
                viewUserCtrl.queryUsers();
                expect(scope.sipClients).toMatch(testSipClients);
                expect(SipClientServiceMock.query).toHaveBeenCalledTimes(1);
            }));

        it('should open UtilityService', inject(function () {
            var service = {
                showDialog: jasmine.createSpy()
            };
            viewUserCtrl = controller("ViewUsersCtrl", {
                $scope: scope,
                UtilityService: service
            });
            viewUserCtrl.showDialog(null);
            expect(service.showDialog).toHaveBeenCalled();
        }));

        it('should load companies', inject(function () {
            expect(CompanyServiceMock.query).toHaveBeenCalled();
            scope.$apply();
            expect(scope.companies).toEqual(testCompanies);
            expect(scope.currentCompany).toBeDefined();
        }));

        it('should not set current Company when there is no company',
            inject(function ($controller, $mdPanel, appConfig, $rootScope) {
                deferred = q.defer();
                scope = $rootScope.$new();
                testCompanies = [];
                viewUserCtrl = $controller("ViewUsersCtrl", {
                    $scope: scope,
                    $mdPanel: $mdPanel,
                    appConfig: appConfig,
                    SipClientService: SipClientServiceMock,
                    CompanyService: CompanyServiceMock
                });
                scope.$apply();
                expect(scope.companies.length).toBe(0);
            }));


    });
});