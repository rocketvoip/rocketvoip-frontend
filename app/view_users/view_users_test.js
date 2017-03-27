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

        it('should add the SIP Client in the array after adding a new sip client', function () {
            var newSipClient = {id: 111, name: 'Jakob Test', phone: "+4935124353345"};
            expect(scope.sipClients.length).toBe(4);
            viewUserCtrl.updateSipClient(newSipClient);
            expect(scope.sipClients.length).toBe(5);
        });

        it('should delete the SIP Client in the array after deleting an existing sip client', function () {
            var deletedSipClient = {id: 2};
            expect(scope.sipClients.length).toBe(4);
            viewUserCtrl.deleteSipClient(deletedSipClient);
            scope.$apply();
            expect(scope.sipClients.length).toBe(3);
        });

        it('should not create SIP Client after editing an existing sip client', function () {
            var newSipClient = {id: 1, name: 'Marco Studerus', phone: "+41223334455"};
            expect(scope.sipClients.length).toBe(4);
            viewUserCtrl.updateSipClient(newSipClient);
            expect(scope.sipClients.length).toBe(4);
        });

        it('should not add undefined sip client to array', function () {
            var newSipClient = undefined;
            expect(scope.sipClients.length).toBe(4);
            viewUserCtrl.updateSipClient(newSipClient);
            expect(scope.sipClients.length).toBe(4);
        });

        it('should not delete undefined sip client', function () {
            var sipClient = undefined;
            expect(scope.sipClients.length).toBe(4);
            viewUserCtrl.deleteSipClient(sipClient);
            expect(scope.sipClients.length).toBe(4);
        });

        it('should create mdPlaneRef', function () {
            var sipClient = undefined;
            var mdPanelRef = viewUserCtrl.showDialog(sipClient);
            rootScope.$apply();
            expect(mdPanelRef).toBeDefined();
        });

        it('should create mdPlaneRef with config', function () {
            var sipClient = undefined;
            var mdPanelRef = viewUserCtrl.showDialog(sipClient);
            rootScope.$apply();
            expect(mdPanelRef.id).toBeDefined();
            expect(mdPanelRef.config).toBeDefined();
            expect(mdPanelRef.config.controller).toEqual('PanelDialogCtrl');
        });

    });
});