'use strict';

describe('rocketvoip.utility_service module', function () {

    beforeEach(module('rocketvoip.utility_service'));
    beforeEach(module('rocketvoip'));
    beforeEach(module('view_login/view_login.html'));
	beforeEach(module('view_dashboard/view_dashboard.html'));

    describe('UtilityService', function () {
        var service, mdToast, mdPanel, scope;
        beforeEach(inject(function ($rootScope, UtilityService, $mdToast, $mdPanel) {
            service = UtilityService;
            mdToast = $mdToast;
            mdPanel = $mdPanel;
            scope = $rootScope.$new();

        }));

        it('should be Defined', inject(function () {
            expect(service).toBeDefined();
        }));

        it('should open mdToast on showToast()', inject(function () {
            mdToast.show = jasmine.createSpy();
            service.showToast("Test");
            expect(mdToast.show).toHaveBeenCalled();
        }));

        it('should create mdPanel on showPanel()', inject(function () {
            var result = service.showDialog(null, null, 'myClass', {}, null);
            scope.$apply();
            expect(result._$mdPanel).toBeDefined();
        }));
        
    });
});