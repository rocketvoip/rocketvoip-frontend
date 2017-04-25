'use strict';
/*
 Module View Dialplan shows all dialplans
 Author: Marco Studerus
 */
angular.module('rocketvoip.view_dialplans', ['ngRoute', 'ngResource'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view_dialplans', {
            templateUrl: 'view_dialplans/view_dialplans.html',
            controller: 'ViewDialplansCtrl'
        });
    }])

    .controller('ViewDialplansCtrl', ['$scope', 'DialplanService', 'UtilityService', 'CompanyService', '$location',
        function ($scope, DialplanService, UtilityService, CompanyService, $location) {
            var ctrl = this;

            this.queryDialplans = function () {
                $scope.dialplans = DialplanService.query();
            };

            this.queryCompanies = function () {
                CompanyService.query().$promise.then(function (companyies) {
                    $scope.companies = companyies;
                    if (companyies.length > 0) {
                        $scope.currentCompany = companyies[0];
                        ctrl.queryDialplans();
                    }
                });
            };

            this.queryCompanies();

            $scope.sortType = 'name';
            $scope.sortReverse = false;


            this.showDialplan = function (dialplan) {
                var id = '';
                var search = {};
                if (dialplan && dialplan.id) {
                    id = dialplan.id;
                }else{
                    search = {
                        companyID: $scope.currentCompany.id,
                        companyName: $scope.currentCompany.name
                    }
                }
                $location.path('/view_editDialplan/' + id).search(search);
            };

        }]).factory('DialplanService', ['$resource', 'appConfig', function ($resource, appConfig) {
    return $resource(appConfig.BACKEND_BASE_URL + appConfig.API_ENDPOINT + '/dialplans/:id', {id: "@id"}, {
            update: {
                method: 'PUT'
            }
        }
    );
}]);