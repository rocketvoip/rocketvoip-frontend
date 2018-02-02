'use strict';

describe('rocketvoip.dialog_resetPassword module', function () {

    beforeEach(module('rocketvoip.dialog_resetPassword'));
    beforeEach(module('view_admins/dialog_resetPassword.html'));
	beforeEach(module('view_login/view_login.html'));
	beforeEach(module('view_dashboard/view_dashboard.html'));
    beforeEach(module('rocketvoip'));

    describe('ResetPasswordDialogCtrl ', function () {
        var scope, ctrl, admin, AdminServiceMock;

        beforeEach(inject(function ($rootScope, $compile, $controller, $templateCache) {
            scope = $rootScope.$new();
            AdminServiceMock = {
                update: jasmine.createSpy()
            };
            admin = {
                CompanyDtoList: [{name: "test01", id: 2}],
                firstName: "test@test.test",
                id: 5,
                lastName: "test@test.test",
                userName: "test@test.test"
            };
            ctrl = $controller("ResetPasswordDialogCtrl", {
                $scope: scope,
                admin: admin,
                AdminPasswordService: AdminServiceMock
            });
            var templateHtml = $templateCache.get('view_admins/dialog_resetPassword.html');
            var formElement = angular.element(templateHtml);
            $compile(formElement)(scope);
            scope.$apply()
        }));

        it('should be Defined', inject(function () {
            expect(ctrl).toBeDefined();
        }));

        it('should save Admin Password', inject(function () {
            scope.admin.password = "NewPassword!";
            scope.confirmPassword = "NewPassword!";
            scope.$apply();
            scope.save();
            expect(AdminServiceMock.update).toHaveBeenCalledTimes(1);
        }));

        it('should not save Admin Password', inject(function () {
            scope.admin.password = "NewPassword!";
            scope.confirmPassword = "NotTheNewPassword";
            scope.$apply();
            scope.save();
            expect(AdminServiceMock.update).toHaveBeenCalledTimes(0);
        }));

    });
});