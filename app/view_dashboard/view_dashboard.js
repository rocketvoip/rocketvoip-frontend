'use strict';

angular.module('rocketvoip.view_dashboard', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: 'view_dashboard/view_dashboard.html',
            controller: 'DashboardCtrl'
        });
    }])

    .controller('DashboardCtrl', function ($scope, CompanyService, SipClientService, DialplanService, AdminService) {
        $scope.companies = CompanyService.query();
        $scope.sipClients = SipClientService.query();
        $scope.dialplans = DialplanService.query();
        $scope.admins = AdminService.query();
    });