'use strict';

describe('rocketvoip.view_users module', function () {

    beforeEach(module('rocketvoip.panel_editUser'));
    beforeEach(module('ngMaterial'));

    describe('PanelDialog controller', function () {

        var scope;
        var panelDialogCtrl;
        var _mdPanelRef = {};
        var updateUserSpy;

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            _mdPanelRef = {};
            _mdPanelRef.close = jasmine.createSpy().and.callFake(function () {
                return {
                    then: function (callback) {
                        return callback();
                    }
                };
            });
            _mdPanelRef.destroy = jasmine.createSpy();
            updateUserSpy = jasmine.createSpy();

            panelDialogCtrl = $controller("PanelDialogCtrl", {
                $scope: scope,
                mdPanelRef: _mdPanelRef,
                user: null,
                updateUser: updateUserSpy
            });

        }));

        it('should be Defined', inject(function () {
            expect(panelDialogCtrl).toBeDefined();
        }));

        it('should set title of panel to "Edit User"', inject(function () {
            panelDialogCtrl.setPlaneTitle();
            expect(scope.title).toEqual("Add a new User");
        }));

        it('should set title of panel to "Edit User"', inject(function ($controller) {
            panelDialogCtrl = $controller("PanelDialogCtrl", {
                $scope: scope,
                mdPanelRef: _mdPanelRef,
                user: {id: 1, name: 'Marco Studerus', phone: "+41223334455"},
                updateUser: {}
            });
            panelDialogCtrl.setPlaneTitle();
            expect(scope.title).toEqual("Edit User 'Marco Studerus'");
        }));

        it('should set id of new Users', inject(function () {

            scope.user = {name: 'Marco Studerus', phone: "+41223334455"};
            panelDialogCtrl.saveUser();

            expect(scope.user.id).toBeDefined();
        }));

        it('should not change id of existing Users', inject(function () {

            scope.user = {id: 1, name: 'Marco Studerus', phone: "+41223334455"};
            panelDialogCtrl.saveUser();
            expect(scope.user.id).toBe(1);
        }));

        it('should call mdPanelRef.close() on save', inject(function () {
            scope.user = {id: 1, name: 'Marco Studerus', phone: "+41223334455"};
            panelDialogCtrl.saveUser();
            scope.$apply();
            expect(_mdPanelRef.close).toHaveBeenCalled();
        }));

        it('should call mdPanelRef.destroy() on save', inject(function () {
            scope.user = {id: 1, name: 'Marco Studerus', phone: "+41223334455"};
            panelDialogCtrl.saveUser();
            scope.$apply();
            expect(_mdPanelRef.destroy).toHaveBeenCalled();
        }));

        it('should call updateUser() on save', inject(function () {
            scope.user = {id: 1, name: 'Marco Studerus', phone: "+41223334455"};
            panelDialogCtrl.saveUser();
            scope.$apply();
            expect(updateUserSpy).toHaveBeenCalled();
        }));


        it('should not save user when name is empty', inject(function () {
            scope.user = {id: 1, phone: "+41223334455"};
            panelDialogCtrl.saveUser();
            scope.$apply();
            expect(updateUserSpy).toHaveBeenCalledTimes(0);
        }));

        it('should not save user when phone is empty', inject(function () {
            scope.user = {id: 1, name: 'Marco Studerus'};
            panelDialogCtrl.saveUser();
            scope.$apply();
            expect(updateUserSpy).toHaveBeenCalledTimes(0);
        }));

        it('should not save user when user is empty', inject(function () {
            scope.user = null;
            panelDialogCtrl.closeDialog = jasmine.createSpy();
            panelDialogCtrl.saveUser();
            scope.$apply();
            expect(panelDialogCtrl.closeDialog).toHaveBeenCalledTimes(0);
        }));
    });
});