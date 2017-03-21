'use strict';
/*
 Module View Users shows all users
 Author: Marco Studerus
 */
angular.module('rocketvoip.view_users', ['ngRoute', 'ngResource'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view_users', {
            templateUrl: 'view_users/view_users.html',
            controller: 'ViewUsersCtrl'
        });
    }])

    .controller('ViewUsersCtrl', ['$scope', '$mdPanel', 'appConfig', 'SipClientService',
        function ($scope, $mdPanel, appConfig, SipClientService) {

            $scope.sipUsers = SipClientService.query();

            $scope.sortType = 'name';
            $scope.sortReverse = false;

            this.updateUser = function (user) {
                if (typeof user !== 'undefined') {

                    var found = false;
                    $scope.sipUsers.some(function (sipUser) {
                        if (sipUser.id === user.id) {
                            angular.copy(user, sipUser);
                            found = true;
                            return true;
                        }
                    });
                    if (!found) {
                        $scope.sipUsers.push(user);
                    }
                }
            };

            this.showDialog = function ($user) {
                var planePosition = $mdPanel.newPanelPosition()
                    .absolute()
                    .center();
                var planeConfig = {
                    attachTo: angular.element(document.body),
                    controller: 'PanelDialogCtrl',
                    controllerAs: 'ctrl',
                    position: planePosition,
                    templateUrl: 'view_users/panel_editUser.html',
                    hasBackdrop: true,
                    panelClass: 'user-dialog',
                    trapFocus: true,
                    zIndex: 150,
                    clickOutsideToClose: true,
                    escapeToClose: true,
                    locals: {
                        "user": $user,
                        "updateUser": this.updateUser,
                        "appConfig": appConfig
                    },
                    focusOnOpen: true
                };

                this._mdPanel = $mdPanel.create(planeConfig);
                this._mdPanel.open();
                return this._mdPanel;
            };
        }])
    .factory('SipClientService', ['$resource', 'appConfig', function ($resource, appConfig) {
        //return $resource(appConfig.BACKEND_BASE_URL + appConfig.API_ENDPOINT + '/sipclient/:id',
        //    {id: "@id"});
        return $resource('http://jsonplaceholder.typicode.com/users/:id', {id: "@id"}, {
                update: {
                    method: 'PUT'
                }
            }
        );

    }]);