'use strict';

describe('rocketvoip.panel_editAction module', function () {

    beforeEach(module('rocketvoip.panel_editAction'));
    beforeEach(module('rocketvoip'));

    describe('panel_action controller', function () {
        var scope, panel, controller, mdPanelRef, action, company;

        beforeEach(inject(function ($rootScope, $controller) {
            mdPanelRef = {};
            mdPanelRef.close = jasmine.createSpy();
            scope = $rootScope.$new();
            action = {};
            company = {};
            controller = $controller;
            panel = $controller("PanelActionDialogCtrl", {
                $scope: scope,
                mdPanelRef: mdPanelRef,
                action: action,
                company: company
            });
        }));

        it('should be Defined', inject(function () {
            expect(panel).toBeDefined();
        }));

        it('should close on closeDialog()', inject(function () {
            scope.closeDialog();
            expect(mdPanelRef.close).toHaveBeenCalledTimes(1);
        }));
    });
});