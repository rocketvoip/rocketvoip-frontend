'use strict';
/**
 * Module View Admins
 * Author: Marco Studerus
 */
angular.module('rocketvoip.view_admins', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view_admins', {
        templateUrl: 'view_admins/view_admins.html',
        controller: 'ViewAdminsCtrl'
    });
}])

.controller('ViewAdminsCtrl', function ($scope, $mdPanel, appConfig, CompanyService, UtilityService) {

    }
).factory('AdminService', ['$resource', 'appConfig', function ($resource, appConfig) {
    return $resource(appConfig.BACKEND_BASE_URL + appConfig.API_ENDPOINT + '/admins/:id', {id: "@id"} ,{
        update: {
            method: 'PUT'
        }
    });
}]);