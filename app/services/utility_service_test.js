'use strict';

describe('rocketvoip.utility_service module', function () {

    beforeEach(module('rocketvoip.utility_service'));
    beforeEach(module('rocketvoip'));

    describe('UtilityService', function () {
        var service, mdToast;
        beforeEach(inject(function (UtilityService,$mdToast) {
            service = UtilityService;
            mdToast = $mdToast;
        }));

        it('should be Defined', inject(function () {
            expect(service).toBeDefined();
        }));

        it('should open mdToast on showToast()', inject(function () {
            mdToast.show = jasmine.createSpy();
            service.showToast("Test");
            expect(mdToast.show).toHaveBeenCalled();
        }));
    });
});