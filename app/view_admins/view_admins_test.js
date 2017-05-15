'use strict';

describe('rocketvoip.view_admins module', function () {

    beforeEach(angular.mock.module('rocketvoip.view_admins'));
    beforeEach(module('ngMaterial'));
    beforeEach(module('rocketvoip'));

    describe('view_admins controller', function () {
        var scope, ctrl, AdminServiceMock, UtilityService;
        beforeEach(inject(function ($rootScope, AdminService, $controller) {

            scope = $rootScope.$new();
            UtilityService = {
                showDialog: jasmine.createSpy()
            };

            AdminServiceMock = {
                query: jasmine.createSpy("AdminServiceMock.query")
            };

            ctrl = $controller("ViewAdminsCtrl", {
                UtilityService: UtilityService,
                AdminService: AdminServiceMock,
                $scope: scope
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
    });
});