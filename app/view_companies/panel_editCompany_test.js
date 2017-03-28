'use strict';

describe('rocketvoip.view_companies module', function () {

    beforeEach(module('rocketvoip.panel_editCompany'));
    beforeEach(module('ngMaterial'));
    beforeEach(module('view_companies/panel_editCompany.html'));
    beforeEach(module('rocketvoip'));

    describe('PanelCompanyDialog controller', function () {

        var scope;
        var panelCompanyDialogCtrl;
        var _mdPanelRef = {};
        var updateCompanySpy;
        var testCompany;
        var _appConfig;
        var CompanyServiceMock;
        var nextID = 1000;
        var $q;
        var deferred;
        var deleteCompanySpy;

        beforeEach(inject(function ($rootScope, $controller, $templateCache, $compile, $q) {
            testCompany = {id: 1, name: "Testcompany1"};

            $q = $q;

            deferred = $q.defer();

            var callbackNgResource = function (company) {
                var ret = {};
                deferred.resolve(company);
                ret.$promise = deferred.promise;
                return ret;
            };

            CompanyServiceMock = {
                save: function (company) {
                    company.id = nextID++;
                    return callbackNgResource(company);
                },
                update: function (company) {
                    deferred.resolve(company);
                    return callbackNgResource(company);
                },
                delete: function (company) {
                    deferred.resolve(company);
                    return callbackNgResource(company);
                }

            };

            scope = $rootScope.$new();
            _mdPanelRef = {};
            _mdPanelRef.close = jasmine.createSpy().and.callFake(function () {
                return {
                    then: function (callback) {
                        return callback();
                    }
                };
            });

            panelCompanyDialogCtrl = $controller("PanelCompanyDialogCtrl", {
                $scope: scope,
                mdPanelRef: _mdPanelRef,
                sipClient: null,
                appConfig: _appConfig,
                company: null,
                CompanyService: CompanyServiceMock
            });

            var templateHtml = $templateCache.get('view_companies/panel_editCompany.html');
            var formElement = angular.element(templateHtml);
            $compile(formElement)(scope);
            scope.$apply()
        }));

        it('should be Defined', inject(function () {
            expect(panelCompanyDialogCtrl).toBeDefined();
        }));

        it('should set title of panel to "Add a new Company"', inject(function () {
            panelCompanyDialogCtrl.setPlaneTitle();
            expect(scope.title).toEqual("Add a new Company");
            expect(scope.isNewCompany).toBeTruthy();

        }));

        it('should set title of panel to "Edit Company"', inject(function ($controller) {
            panelCompanyDialogCtrl = $controller("PanelCompanyDialogCtrl", {
                $scope: scope,
                mdPanelRef: _mdPanelRef,
                company: testCompany,
                updateSipClient: {},
                deleteSipClient: {}
            });
            panelCompanyDialogCtrl.setPlaneTitle();
            expect(scope.title).toEqual("Edit User 'Testcompany1'");
            expect(scope.isNewCompany).toBeFalsy();
        }));

        it('should set id of new company', inject(function () {
            scope.company = {name: 'Testcompany2'};
            scope.$apply();
            panelCompanyDialogCtrl.saveCompany();
            expect(scope.company.id).toBeDefined();
        }));

        it('should not change id of existing company', inject(function () {
            scope.company = testCompany;
            scope.$apply();
            panelCompanyDialogCtrl.saveCompany();
            expect(scope.company.id).toBe(1);
        }));

        it('should call mdPanelRef.close() on save', inject(function () {
            scope.company = testCompany;
            scope.$apply();
            panelCompanyDialogCtrl.saveCompany();
            scope.$apply();
            expect(_mdPanelRef.close).toHaveBeenCalled();
        }));

        it('should call mdPanelRef.close() on delete (edit company)', inject(function () {
            scope.company = {id: 1, name: 'Testcompany3'};
            scope.$apply();
            panelCompanyDialogCtrl.deleteCompany();
            scope.$apply();
            expect(_mdPanelRef.close).toHaveBeenCalled();
        }));

        it('should not delete & close company when id is not defined', inject(function () {
            scope.company = {name: "Testcompany2"};
            scope.$apply();
            panelCompanyDialogCtrl.deleteCompany();
            scope.$apply();
            expect(_mdPanelRef.close).toHaveBeenCalledTimes(0);
        }));

        it('should not close company when name is empty', inject(function () {
            scope.company = {id: 1};
            scope.$apply();
            panelCompanyDialogCtrl.saveCompany();
            scope.$apply();
            expect(_mdPanelRef.close).toHaveBeenCalledTimes(0);
        }));

        it('should not save company when company is null', inject(function () {
            scope.company = null;
            panelCompanyDialogCtrl.closeDialog = jasmine.createSpy();
            scope.$apply();
            panelCompanyDialogCtrl.saveCompany();
            scope.$apply();
            expect(panelCompanyDialogCtrl.closeDialog).toHaveBeenCalledTimes(0);
        }));
    });
});