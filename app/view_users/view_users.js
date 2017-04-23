'use strict';
/*
 Module View Users shows all Sip Clients
 Author: Marco Studerus, Martin Wittwer
 */
angular.module('rocketvoip.view_users', ['ngRoute', 'ngResource'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view_users', {
            templateUrl: 'view_users/view_users.html',
            controller: 'ViewUsersCtrl'
        });
    }])

    .controller('ViewUsersCtrl', ['$scope', 'appConfig', 'SipClientService', 'UtilityService', 'CompanyService',
        function ($scope, appConfig, SipClientService, UtilityService, CompanyService) {
            var ctrl = this;

            this.queryUsers = function () {
                $scope.sipClients = SipClientService.query();
            };

            CompanyService.query().$promise.then(function (companyies) {
                $scope.companies = companyies;
                if (companyies.length > 0) {
                    $scope.currentCompany = companyies[0];
                    ctrl.queryUsers();
                }
            });

            $scope.sortType = 'name';
            $scope.sortReverse = false;

            this.showDialog = function (sipClient) {
                UtilityService.showDialog(
                    'PanelEditSipClientDialogCtrl',
                    'view_users/panel_editUser.html',
                    'user-dialog',
                    {
                        'sipClient': sipClient,
                        'company': $scope.currentCompany
                    },
                    ctrl.queryUsers);
            };
        }])
    .factory('SipClientService', ['$resource', 'appConfig', function ($resource, appConfig) {
        return $resource(appConfig.BACKEND_BASE_URL + appConfig.API_ENDPOINT + '/sipclients/:id', {id: "@id"}, {
                update: {
                    method: 'PUT'
                }
            }
        );
    }]);