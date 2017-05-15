'use strict';

describe('rocketvoip.view_dashboard module', function () {

    beforeEach(module('rocketvoip.view_dashboard'));

    describe('dashboard controller', function () {
        var scope, httpMock, ctrl;

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            httpMock = {
                query: jasmine.createSpy()
            };

            ctrl = $controller("DashboardCtrl", {
                $scope: scope,
                AdminService: httpMock,
                SipClientService: httpMock,
                CompanyService: httpMock,
                DialplanService: httpMock
            });
        }));

        it('should be defined', inject(function ($controller) {
            expect(ctrl).toBeDefined();
        }));

    });
});