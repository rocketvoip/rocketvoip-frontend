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

    .controller('ViewUsersCtrl', ['$scope', '$mdPanel', 'appConfig', 'SipClientService',
        function ($scope, $mdPanel, appConfig, SipClientService) {

            $scope.sipClients = SipClientService.query();

            $scope.sortType = 'name';
            $scope.sortReverse = false;

            this.updateSipClient = function (updatedSipClient) {
                if (typeof updatedSipClient !== 'undefined') {

                    var found = false;
                    $scope.sipClients.some(function (sipClient) {
                        if (sipClient.id === updatedSipClient.id) {
                            angular.copy(updatedSipClient, sipClient);
                            found = true;
                            return true;
                        }
                    });
                    if (!found) {
                        $scope.sipClients.push(updatedSipClient);
                    }
                }
            };

            this.showDialog = function ($sipClient) {
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
                        "sipClient": $sipClient,
                        "updateSipClient": this.updateSipClient,
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
        return $resource(appConfig.BACKEND_BASE_URL + appConfig.API_ENDPOINT + '/sipclients/:id', {id: "@id"}, {
                update: {
                    method: 'PUT'
                }
            }
        );
    }]);