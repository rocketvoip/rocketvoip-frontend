'use strict';

describe('rocketvoip.panel_editAction module', function () {

    beforeEach(module('rocketvoip.panel_editAction'));
    beforeEach(module('rocketvoip'));
    beforeEach(module('view_dialplans/panel_action.html'));


    describe('panel_action controller', function () {
        var scope, panel, controller, mdPanelRef, action, company, templateCache, compile, callbackUpdate,
            callbackDelete, SipClientService;

        function loadFormHTML() {
            var templateHtml = templateCache.get('view_dialplans/panel_action.html');
            var formElement = angular.element(templateHtml);
            compile(formElement)(scope);
            scope.$apply();
        }

        beforeEach(inject(function ($rootScope, $controller, $templateCache, $compile) {
            templateCache = $templateCache;
            compile = $compile;
            mdPanelRef = {};
            mdPanelRef.close = jasmine.createSpy();
            scope = $rootScope.$new();
            action = {};
            company = {};
            callbackUpdate = jasmine.createSpy();
            callbackDelete = jasmine.createSpy();
            controller = $controller;
            loadFormHTML();
            SipClientService = {
                query: jasmine.createSpy()
            };

            panel = $controller("PanelActionDialogCtrl", {
                $scope: scope,
                mdPanelRef: mdPanelRef,
                action: action,
                company: company,
                callbackDelete: callbackDelete,
                callbackUpdate: callbackUpdate,
                SipClientService: SipClientService
            });

        }));

        it('should be Defined', inject(function () {
            expect(panel).toBeDefined();
        }));

        it('should close on closeDialog()', inject(function () {
            scope.closeDialog();
            expect(mdPanelRef.close).toHaveBeenCalledTimes(1);
        }));

        it('should not save action when form is invalid', inject(function () {
            scope.saveAction();
            spyOn(scope, 'closeDialog');
            expect(scope.closeDialog).toHaveBeenCalledTimes(0);
        }));

        it('should save action when form is valid', inject(function () {
            scope.action.name = "Test123";
            scope.action.type = "SayAlpha";
            scope.action.typeSpecific = {
                voiceMessage: "Test Message",
                sleepTime: 5
            };
            scope.$apply();
            scope.saveAction();
            scope.$apply();
            expect(callbackUpdate).toHaveBeenCalledTimes(1);
        }));

        it('should not delete new action', inject(function () {
            scope.isNewAction = true;
            scope.deleteAction();
            expect(callbackDelete).toHaveBeenCalledTimes(0);
        }));

        it('should delete existing action', inject(function () {
            scope.isNewDialplan = false;
            scope.deleteAction();
            scope.$apply();
            expect(callbackDelete).toHaveBeenCalledTimes(1);
        }));

        it('should load SipClients when selecting Dial', inject(function () {
            scope.action.type = "Dial";
            scope.initType();
            expect(SipClientService.query).toHaveBeenCalledTimes(1);
        }));

        it('should set isNewDialplan to false for existing actions', inject(function () {
            action.name = "Test";

            panel = controller("PanelActionDialogCtrl", {
                $scope: scope,
                mdPanelRef: mdPanelRef,
                action: action,
                company: company,
                callbackDelete: callbackDelete,
                callbackUpdate: callbackUpdate
            });

            expect(scope.isNewDialplan).toBeFalsy();
        }));

    });
});