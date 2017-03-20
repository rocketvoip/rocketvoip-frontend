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
        var testUsers;
        var mdPanel;

        beforeEach(inject(function ($rootScope, $controller, _$mdPanel_, appConfig) {
            mdPanel = _$mdPanel_;
            scope = $rootScope.$new();
            rootScope = $rootScope;

            viewUserCtrl = $controller("ViewUsersCtrl", {
                $scope: scope,
                $mdPanel: _$mdPanel_,
                appConfig: appConfig
            });
            testUsers = [
                {id: 1, name: 'Marco Studerus', phone: "+41223334455"},
                {id: 2, name: 'Martin Wittwer', phone: "+41223334455"},
                {id: 3, name: 'Jona Braun', phone: "+41223334455"},
                {id: 4, name: 'Jonny Däpp', phone: "+41223334455"}];
        }));

        it('should be Defined', inject(function () {
            expect(viewUserCtrl).toBeDefined();
        }));

        it('should update the SIP Client in the array after adding a new sip client', function () {
            var newUser = {id: 111, name: 'Jakob Test', phone: "+4935124353345"};
            scope.sipUsers = angular.copy(testUsers);
            expect(scope.sipUsers.length).toBe(4);
            viewUserCtrl.updateUser(newUser);
            expect(scope.sipUsers.length).toBe(5);
        });

        it('should not create SIP Client after editing an existing sip client', function () {
            var newUser = {id: 1, name: 'Marco Studerus', phone: "+41223334455"};
            scope.sipUsers = testUsers;
            expect(scope.sipUsers.length).toBe(4);
            viewUserCtrl.updateUser(newUser);
            expect(scope.sipUsers.length).toBe(4);
        });

        it('should not add undefined sip client to array', function () {
            var newUser = undefined;
            scope.sipUsers = testUsers;
            expect(scope.sipUsers.length).toBe(4);
            viewUserCtrl.updateUser(newUser);
            expect(scope.sipUsers.length).toBe(4);
        });


        it('should create mdPlaneRef', function () {
            var newUser = undefined;
            var mdPanelRef = viewUserCtrl.showDialog(newUser);
            rootScope.$apply();
            expect(mdPanelRef).toBeDefined();
        });

        it('should create mdPlaneRef with config', function () {
            var newUser = undefined;
            var mdPanelRef = viewUserCtrl.showDialog(newUser);
            rootScope.$apply();
            expect(mdPanelRef.id).toBeDefined();
            expect(mdPanelRef.config).toBeDefined();
            expect(mdPanelRef.config.controller).toEqual('PanelDialogCtrl');
        });


    });
});