'use strict';

describe('rocketvoip.view_admins module', function () {

    beforeEach(angular.mock.module('rocketvoip.view_admins'));
    beforeEach(module('ngMaterial'));
    beforeEach(module('rocketvoip'));

    describe('view_admins controller', function () {
        var scope, ctrl, AdminServiceMock;
        beforeEach(inject(function ($rootScope, AdminService, $controller) {

            scope = $rootScope.$new();

            AdminServiceMock = {
                query: jasmine.createSpy("AdminServiceMock.query")
            };

            ctrl = $controller("ViewAdminsCtrl", {
                AdminService: AdminServiceMock,
                $scope: scope
            });
        }));

        it('should be Defined', inject(function () {
            expect(ctrl).toBeDefined();
        }));
    });
});