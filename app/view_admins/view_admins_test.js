'use strict';

describe('rocketvoip.view_admins module', function () {

    beforeEach(angular.mock.module('rocketvoip.view_admins'));
    beforeEach(module('ngMaterial'));
    beforeEach(module('view_login/view_login.html'));
	beforeEach(module('view_dashboard/view_dashboard.html'));
    beforeEach(module('rocketvoip'));

    describe('view_admins controller', function () {
        var scope, ctrl, AdminServiceMock, UtilityService, mdDialog;
        beforeEach(inject(function ($rootScope, AdminService, $controller) {
            scope = $rootScope.$new();
            UtilityService = {
                showDialog: jasmine.createSpy()
            };
            mdDialog = {
                show: jasmine.createSpy()
            };
            AdminServiceMock = {
                query: jasmine.createSpy("AdminServiceMock.query")
            };
            ctrl = $controller("ViewAdminsCtrl", {
                UtilityService: UtilityService,
                AdminService: AdminServiceMock,
                $scope: scope,
                $mdDialog: mdDialog
            });
        }));

        it('should be Defined', inject(function () {
            expect(ctrl).toBeDefined();
        }));

        it('should open panel', inject(function () {
            scope.showDialog();
            scope.$apply();
            expect(UtilityService.showDialog).toHaveBeenCalledTimes(1);
        }));

        it('should open dialog', inject(function () {
            scope.changeAdminPassword();
            scope.$apply();
            expect(mdDialog.show).toHaveBeenCalledTimes(1);
        }));
    });
});