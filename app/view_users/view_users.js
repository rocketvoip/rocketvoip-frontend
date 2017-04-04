'use strict';
/*
 Module View Users shows all Sip Clients
 Author: Marco Studerus
 */
angular.module('rocketvoip.view_users', ['ngRoute', 'ngResource'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view_users', {
            templateUrl: 'view_users/view_users.html',
            controller: 'ViewUsersCtrl'
        });
    }])

    .controller('ViewUsersCtrl', ['$scope', '$mdPanel', 'appConfig', 'SipClientService', 'UtilityService',
        function ($scope, $mdPanel, appConfig, SipClientService, UtilityService) {

            this.queryUsers = function () {
                $scope.sipClients = SipClientService.query();
            };

            this.queryUsers();

            $scope.sortType = 'name';
            $scope.sortReverse = false;

            this.showDialog = function(sipClient, ctrl) {
                UtilityService.showDialog(
                    'PanelDialogCtrl',
                    'view_users/panel_editUser.html',
                    'user-dialog',
                    {'sipClient': sipClient },
                    ctrl.queryUsers);
            }
        }])
    .factory('SipClientService', ['$resource', 'appConfig', function ($resource, appConfig) {
        return $resource(appConfig.BACKEND_BASE_URL + appConfig.API_ENDPOINT + '/sipclients/:id', {id: "@id"}, {
                update: {
                    method: 'PUT'
                }
            }
        );
    }]);