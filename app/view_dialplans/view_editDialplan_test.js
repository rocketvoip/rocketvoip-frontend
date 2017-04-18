'use strict';
describe('rocketvoip.view_editDialplan module', function () {

    beforeEach(module('rocketvoip.view_editDialplan'));
    beforeEach(module('rocketvoip'));

    describe('view_editDialplan controller', function () {
        var scope, ctrl, location, controller;

        beforeEach(inject(function ($rootScope, $controller, appConfig) {

            location = {
                path: jasmine.createSpy().and.returnValue({search: jasmine.createSpy()}),
                search: jasmine.createSpy().and.returnValue({
                    params: {
                        companyID: 4,
                        companyName: 'TestCompany'
                    }
                })
            };

            scope = $rootScope.$new();
            controller = $controller;
            ctrl = $controller("ViewEditDialplanCtrl", {
                $scope: scope,
                appConfig: appConfig,
                $location: location
            });
        }));

        it('should be Defined', inject(function () {
            expect(ctrl).toBeDefined();
        }));

    });
});