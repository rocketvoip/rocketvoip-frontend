'use strict';
/*
 Module panel_editAction is a dialog for adding or editing an action for dialplans
 Author: Marco Studerus
 */
angular.module('rocketvoip.panel_editAction', ['angular.filter'])
    .controller('PanelActionDialogCtrl', ['$scope', 'mdPanelRef', 'action', 'company', 'ActionService', 'UtilityService', 'SipClientService',
        function ($scope, mdPanelRef, action, company, ActionService, UtilityService, SipClientService) {
            $scope.types = [
                {
                    name: 'TEAM',
                    text: 'Team'
                },
                {
                    name: 'VOICE_MESSAGE',
                    text: 'Voice Message'
                }
            ];

            $scope.closeDialog = function () {
                mdPanelRef && mdPanelRef.close();
            };

            $scope.saveAction = function () {
                if ($scope.actionEditForm.$valid) {
                    if ($scope.action.id == undefined) {
                        ActionService.save($scope.action).$promise.then(this.closeDialog);
                    } else {
                        ActionService.update($scope.action).$promise.then(this.closeDialog);
                    }
                } else {
                    UtilityService.setAllFieldsTouched($scope.actionEditForm);
                }
            };

            $scope.deleteAction = function () {
                if ($scope.action.id != null) {
                    ActionService.delete($scope.action).$promise.then(this.closeDialog);
                }
            };

            $scope.initType = function () {
                if ($scope.action.type === "TEAM") {
                    $scope.sipClients = SipClientService.query();
                }
            };

            $scope.action = angular.copy(action);
            if (action && action.name) {
                $scope.nameCopy = angular.copy(action.name);
            } else {
                $scope.isNewDialplan = true;
                $scope.action = {
                    team: [],
                    company: company
                };
            }

            $scope.initType();
        }
    ]).factory('ActionService', ['$resource', 'appConfig', function ($resource, appConfig) {
    return $resource(appConfig.BACKEND_BASE_URL + appConfig.API_ENDPOINT + '/action/:id', {id: "@id"}, {
            update: {
                method: 'PUT'
            }
        }
    );
}]);