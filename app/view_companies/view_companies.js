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

.controller('ViewCompaniesCtrl', function ($scope, $mdPanel, appConfig, CompanyService, UtilityService) {

        this.queryCompanies = function () {
            $scope.companies = CompanyService.query();
        };

        this.queryCompanies();

        $scope.sortType = 'name';
        $scope.sortReverse = false;

        this.showDialog = function (company, ctrl) {
            UtilityService.showDialog(
                'PanelCompanyDialogCtrl',
                'view_companies/panel_editCompany.html',
                'company-dialog',
                { 'company': company},
                ctrl.queryCompanies);
        }
    }
)

.factory('CompanyService', ['$resource', 'appConfig', function ($resource, appConfig) {
    return $resource(appConfig.BACKEND_BASE_URL + appConfig.API_ENDPOINT + '/companies/:id', {id: "@id"} ,{
        update: {
            method: 'PUT'
        }
    });
}]);