'use strict';

describe('rocketvoip.Panel_editAdmin module', function () {

    beforeEach(module('rocketvoip.panel_editAdmin'));
    beforeEach(module('view_admins/panel_editAdmin.html'));
    beforeEach(module('view_login/view_login.html'));
	beforeEach(module('view_dashboard/view_dashboard.html'));
    beforeEach(module('rocketvoip'));

    describe('PanelEditAdminDialogCtrl ', function () {
        var scope, panelDialogCtrl, CompanyServiceMock, testCompanies, AdminService, mdPanelRef, testAdmin;

        beforeEach(inject(function ($rootScope, $compile, AdminPasswordService, $controller, $templateCache) {
            testAdmin = {
                "id": 55,
                "userName": "good@good.ch",
                "password": "12345678",
                "firstName": "Good",
                "lastName": "User",
                "companyDtoList": []
            };
            testCompanies = [{id: 1, name: "Test Company"}];
            scope = $rootScope.$new();
            CompanyServiceMock = {
                query: jasmine.createSpy('CompanyService query').and.returnValue(testCompanies)
            };

            var callbackNgResource = jasmine.createSpy().and.returnValue({
                $promise: {
                    then: function (callback) {
                        callback();
                    }
                }
            });

            mdPanelRef = {
                close: jasmine.createSpy()
            };

            AdminService = {
                save: callbackNgResource,
                update: callbackNgResource,
                delete: callbackNgResource
            };
            panelDialogCtrl = $controller("PanelEditAdminDialogCtrl", {
                $scope: scope,
                admin: null,
                mdPanelRef: mdPanelRef,
                CompanyService: CompanyServiceMock,
                AdminService: AdminService
            });

            var templateHtml = $templateCache.get('view_admins/panel_editAdmin.html');
            var formElement = angular.element(templateHtml);
            $compile(formElement)(scope);
            scope.$apply()
        }));

        it('should be Defined', inject(function () {
            expect(panelDialogCtrl).toBeDefined();
        }));

        it('should save new admin', inject(function () {
            scope.admin = {
                "userName": "good@good.ch",
                "password": "12345678",
                "firstName": "Good",
                "lastName": "User",
                "companyDtoList": [{"name": "testcompany01", "id": 2}]
            };
            scope.confirmPassword = scope.admin.password;
            scope.$apply();
            scope.save();
            expect(AdminService.save).toHaveBeenCalledTimes(1);
        }));

        it('should update existing admin', inject(function () {
            scope.isNewAdmin = false;
            scope.admin = {
                "id": 55,
                "userName": "good@good.ch",
                "password": "12345678",
                "firstName": "Good",
                "lastName": "User",
                "companyDtoList": [{"name": "company", "id": 2}]
            };
            scope.$apply();
            scope.save();
            expect(AdminService.update).toHaveBeenCalledTimes(1);
        }));

        it('should not save admin without access to company', inject(function () {
            scope.admin = testAdmin;
            scope.$apply();
            scope.save();
            expect(AdminService.update).toHaveBeenCalledTimes(0);
            expect(AdminService.save).toHaveBeenCalledTimes(0);
        }));

        it('should delete user', inject(function () {
            scope.delete();
            scope.$apply();
            expect(AdminService.delete).toHaveBeenCalledTimes(1);
        }));

        it('should initialize existing admin', inject(function ($controller) {
            panelDialogCtrl = $controller("PanelEditAdminDialogCtrl", {
                $scope: scope,
                admin: testAdmin,
                mdPanelRef: mdPanelRef,
                CompanyService: CompanyServiceMock,
                AdminService: AdminService
            });
            expect(scope.nameCopy).toBeDefined();
        }));
    });
});