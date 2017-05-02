'use strict';

describe('rocketvoip.panel_editAction module', function () {

    beforeEach(module('rocketvoip.panel_editAction'));
    beforeEach(module('rocketvoip'));
    beforeEach(module('view_dialplans/panel_action.html'));


    describe('panel_action controller', function () {
        var scope, panel, controller, mdPanelRef, action, company, templateCache, compile, callbackAction,
            SipClientService, DialplanService;

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

            callbackAction = {
                "update": jasmine.createSpy(),
                "delete": jasmine.createSpy(),
                "create": jasmine.createSpy()
            };
            controller = $controller;
            loadFormHTML();
            SipClientService = {
                query: jasmine.createSpy()
            };

            DialplanService = {
                query: jasmine.createSpy()
            };

            panel = $controller("PanelActionDialogCtrl", {
                $scope: scope,
                mdPanelRef: mdPanelRef,
                action: action,
                company: company,
                callbackAction: callbackAction,
                SipClientService: SipClientService,
                DialplanService: DialplanService
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
            scope.$apply();
            scope.saveAction();
            spyOn(scope, 'closeDialog');
            expect(scope.closeDialog).toHaveBeenCalledTimes(0);
        }));

        it('should save new action when form is valid', inject(function () {
            scope.action.name = "Test123";
            scope.action.type = "SayAlpha";
            scope.action.typeSpecific = {
                voiceMessage: "Test Message",
                sleepTime: 5
            };
            scope.$apply();
            scope.saveAction();
            scope.$apply();
            expect(callbackAction.create).toHaveBeenCalledTimes(1);
        }));


        it('should update action when form is valid', inject(function () {
            scope.isNewDialplan = false;
            scope.action.id = 55;
            scope.action.name = "Test123";
            scope.action.type = "SayAlpha";
            scope.action.typeSpecific = {
                voiceMessage: "Test Message",
                sleepTime: 5
            };
            scope.$apply();
            scope.saveAction();
            scope.$apply();
            expect(callbackAction.update).toHaveBeenCalledTimes(1);
        }));

        it('should not delete new action', inject(function () {
            scope.isNewAction = true;
            scope.deleteAction();
            expect(callbackAction.delete).toHaveBeenCalledTimes(0);
        }));

        it('should delete existing action', inject(function () {
            scope.isNewDialplan = false;
            scope.deleteAction();
            scope.$apply();
            expect(callbackAction.delete).toHaveBeenCalledTimes(1);
        }));

        it('should load SipClients', inject(function () {
            expect(SipClientService.query).toHaveBeenCalledTimes(1);
        }));

        it('should load Dialplans', inject(function () {
            expect(DialplanService.query).toHaveBeenCalledTimes(1);
        }));


        it('should initialize type SayAlpha', inject(function () {
            expect(scope.action.typeSpecific).toBeUndefined();
            scope.action.type = "SayAlpha";
            scope.initType();
            expect(scope.action.typeSpecific.sleepTime).toBeDefined()
        }));

        it('should set isNewDialplan to false for existing actions', inject(function () {
            action.name = "Test";
            panel = controller("PanelActionDialogCtrl", {
                $scope: scope,
                mdPanelRef: mdPanelRef,
                action: action,
                company: company,
                callbackAction: callbackAction
            });
            expect(scope.isNewDialplan).toBeFalsy();
        }));

        it('should remove last empty dialplanID (Type: Branch)', inject(function () {
            scope.action.type = "Branch";
            scope.action.typeSpecific = {
                nextDialPlanIds: [1, 2, undefined]
            };
            scope.actionEditForm.$valid = true;
            scope.saveAction();
            scope.$apply();
            expect(scope.action.typeSpecific.nextDialPlanIds).toEqual([1, 2]);
        }));

        it('should not remove last empty dialplanID (Type: Branch)', inject(function () {
            scope.action.type = "Branch";
            scope.action.typeSpecific = {
                nextDialPlanIds: [1, 2]
            };
            scope.actionEditForm.$valid = true;
            scope.saveAction();
            scope.$apply();
            expect(scope.action.typeSpecific.nextDialPlanIds).toEqual([1, 2]);
        }));

        it('should remove dialplanID (Type: Branch)', inject(function () {
            scope.action.typeSpecific = {
                nextDialPlanIds: [1, 2, 3, undefined]
            };
            scope.deleteBranchOption(1)
            scope.$apply();
            expect(scope.action.typeSpecific.nextDialPlanIds).toEqual([1, 3, undefined]);
        }));

        it('should not add empty branch option', inject(function () {
            scope.action.typeSpecific = {
                nextDialPlanIds: [1, 2, 3, undefined]
            };
            scope.branchOptionChange();
            scope.$apply();
            expect(scope.action.typeSpecific.nextDialPlanIds).toEqual([1, 2, 3, undefined]);
        }));

        it('should add empty branch option', inject(function () {
            scope.action.typeSpecific = {
                nextDialPlanIds: [1, 2, 3]
            };
            scope.branchOptionChange();
            scope.$apply();
            expect(scope.action.typeSpecific.nextDialPlanIds).toEqual([1, 2, 3, undefined]);
        }));

        it('should not add empty branch option if there are already 9', inject(function () {
            scope.action.typeSpecific = {
                nextDialPlanIds: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            };
            scope.branchOptionChange();
            scope.$apply();
            expect(scope.action.typeSpecific.nextDialPlanIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }));

        it('should init Type Dial', inject(function () {
            scope.action.type = "Dial";
            scope.initType();
            scope.$apply();
            expect(scope.action.typeSpecific.ringingTime).toEqual(15);
        }));

        it('should init Type SayAlpha', inject(function () {
            scope.action.type = "SayAlpha";
            scope.initType();
            scope.$apply();
            expect(scope.action.typeSpecific.sleepTime).toEqual(3);
        }));

        it('should init Type Goto', inject(function () {
            scope.action.type = "Goto";
            scope.initType();
            scope.$apply();
            expect(scope.action.typeSpecific.nextDialPlanId).toBeDefined();
        }));

        it('should init Type Branch', inject(function () {
            scope.action.type = "Branch";
            scope.initType();
            scope.$apply();
            expect(scope.action.typeSpecific.nextDialPlanIds).toBeDefined();
        }));

        it('should not init unknown Type', inject(function () {
            scope.action.type = "Test";
            scope.initType();
            scope.$apply();
            expect(scope.action.typeSpecific).toBeUndefined();
        }));

        it('should set isNewDialplan to false for existing actions', inject(function () {
            action.name = "Test";
            action.type = "Branch";
            action.typeSpecific = {
                nextDialPlanIds: [1, 2, 3]
            };
            panel = controller("PanelActionDialogCtrl", {
                $scope: scope,
                mdPanelRef: mdPanelRef,
                action: action,
                company: company,
                callbackAction: callbackAction,
                DialplanService: DialplanService,
                SipClientService: SipClientService
            });
            scope.$apply();
            expect(scope.action.typeSpecific.nextDialPlanIds).toEqual([1, 2, 3, undefined]);

        }));

    });
});