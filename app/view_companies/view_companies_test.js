'use strict';

describe('rocketvoip.view_companies module', function () {

    beforeEach(angular.mock.module('rocketvoip.view_companies'));
    beforeEach(module('ngMaterial'));
    beforeEach(module('rocketvoip.panel_editCompany'));
    beforeEach(module('rocketvoip'));

    describe('view_companies controller', function () {

        var scope;
        var rootScope;
        var viewCompanyCtrl;
        var testCompanies;
        var mdPanel;
        var CompanyServiceMock;
        var controller;

        beforeEach(inject(function ($rootScope, $controller, $mdPanel, appConfig) {
            testCompanies = [
                {id: 1, name: 'Testcompany1'},
                {id: 2, name: 'Testcompany2'},
                {id: 3, name: 'Testcomapny3'}
            ];
            mdPanel = $mdPanel;
            scope = $rootScope.$new();
            rootScope = $rootScope;
            controller = $controller;
            CompanyServiceMock = {
                query: function () {
                    return testCompanies;
                }
            };

            viewCompanyCtrl = $controller("ViewCompaniesCtrl", {
                $scope: scope,
                $mdPanel: $mdPanel,
                appConfig: appConfig,
                CompanyService: CompanyServiceMock
            });
        }));

        it('should be Defined', inject(function () {
            expect(viewCompanyCtrl).toBeDefined();
        }));

        it('should call CompanyService to query companies', inject(function () {
            viewCompanyCtrl.queryCompanies();
            expect(scope.companies).toEqual(testCompanies);
        }));

        it('should open Dialog', inject(function () {
            var UtilityService = {
                showDialog: jasmine.createSpy()
            };
            viewCompanyCtrl = controller("ViewCompaniesCtrl", {
                $scope: scope,
                $mdPanel: mdPanel,
                UtilityService: UtilityService,
                CompanyService: CompanyServiceMock
            });
            viewCompanyCtrl.showDialog(null, viewCompanyCtrl);
            expect(UtilityService.showDialog).toHaveBeenCalled();
        }));
    });
});