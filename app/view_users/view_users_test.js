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

        beforeEach(inject(function ($rootScope, $controller, $mdPanel, appConfig) {
            testSipClients = [
                {id: 1, name: 'Marco Studerus', phone: "+41223334455"},
                {id: 2, name: 'Martin Wittwer', phone: "+41223334455"},
                {id: 3, name: 'Jona Braun', phone: "+41223334455"},
                {id: 4, name: 'Hans Peter', phone: "+41223334455"}];
            mdPanel = $mdPanel;
            scope = $rootScope.$new();
            rootScope = $rootScope;
            SipClientServiceMock = {
                query: function () {
                    return testSipClients;
                }
            };
            viewUserCtrl = $controller("ViewUsersCtrl", {
                $scope: scope,
                $mdPanel: $mdPanel,
                appConfig: appConfig,
                SipClientService: SipClientServiceMock
            });

        }));

        it('should be Defined', inject(function () {
            expect(viewUserCtrl).toBeDefined();
        }));

        if('should call SipClientService to query clients', inject(function () {
            viewUserCtrl.queryUsers();
            expect(scope.sipClients).toEqual(testSipClients);
        }));
    });
});