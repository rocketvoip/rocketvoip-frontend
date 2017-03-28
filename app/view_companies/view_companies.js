'use strict';
/**
 * Module View Companies shows all companies and let you edit them
 * Author: Martin Wittwer
 */
angular.module('rocketvoip.view_companies', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view_companies', {
        templateUrl: 'view_companies/view_companies.html',
        controller: 'ViewCompaniesCtrl'
    });
}])

.controller('ViewCompaniesCtrl', ['$scope', '$mdPanel', 'appConfig', 'CompanyService', 'Dialog',
    function ($scope, $mdPanel, appConfig, CompanyService, Dialog) {

        this.queryCompanies = function () {
            $scope.companies = CompanyService.query();
        };

        this.queryCompanies();

        $scope.sortType = 'name';
        $scope.sortReverse = false;

        this.showDialog = Dialog;
    }
])

.factory('CompanyService', ['$resource', 'appConfig', function ($resource, appConfig) {
    return $resource(appConfig.BACKEND_BASE_URL + appConfig.API_ENDPOINT + '/companies/:id', {id: "@id"} ,{
        update: {
            method: 'PUT'
        }
    });
}]);