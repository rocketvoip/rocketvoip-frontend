'use strict';

describe('rocketvoip.view_companies module', function () {

    beforeEach(module('rocketvoip.view_dialplans'));

    describe('view_companies controller', function () {

        var scope, viewDialplansCtrl, controller;

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller;

            viewDialplansCtrl = $controller("ViewDialplansCtrl", {
                $scope: scope
            });
        }));

        it('should be Defined', inject(function () {
            expect(viewDialplansCtrl).toBeDefined();
        }));
    });
});