'use strict';

describe('rocketvoip.Panel_editAdmin module', function () {

    beforeEach(module('rocketvoip.panel_editAdmin'));
    beforeEach(module('view_admins/panel_editAdmin.html'));
    beforeEach(module('rocketvoip'));

    describe('PanelEditAdminDialogCtrl ', function () {
        var scope, panelDialogCtrl, CompanyServiceMock, testCompanies;

        beforeEach(inject(function ($rootScope, $compile, $controller, $templateCache) {
            testCompanies = [{id: 1, name: "Test Company"}];
            scope = $rootScope.$new();
            CompanyServiceMock = {
                query: jasmine.createSpy('CompanyService query').and.returnValue(testCompanies)
            };

            panelDialogCtrl = $controller("PanelEditAdminDialogCtrl", {
                $scope: scope,
                admin: null,
                mdPanelRef: null,
                CompanyService: CompanyServiceMock
            });

            var templateHtml = $templateCache.get('view_admins/panel_editAdmin.html');
            var formElement = angular.element(templateHtml);
            $compile(formElement)(scope);
            scope.$apply()
        }));

        it('should be Defined', inject(function () {
            expect(panelDialogCtrl).toBeDefined();
        }));
    });
});