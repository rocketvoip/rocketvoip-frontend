'use strict';

describe('rocketvoip.view_dashboard module', function () {

    beforeEach(module('rocketvoip.view_dashboard'));

    describe('dashboard controller', function () {

        it('should be defined', inject(function ($controller) {
            var dashboardCtrl = $controller('DashboardCtrl');
            expect(dashboardCtrl).toBeDefined();
        }));

    });
});