'use strict';

describe('rocketvoip.view_companies module', function () {

    beforeEach(module('rocketvoip.view_dialplans'));
    beforeEach(module('rocketvoip'));


    describe('view_companies controller', function () {

        var scope, viewDialplansCtrl, controller;

        beforeEach(inject(function ($rootScope, $controller, appConfig) {
            scope = $rootScope.$new();
            controller = $controller;
            viewDialplansCtrl = $controller("ViewDialplansCtrl", {
                $scope: scope,
                appConfig: appConfig
            });
        }));

        it('should be Defined', inject(function () {
            expect(viewDialplansCtrl).toBeDefined();
        }));
    });
});