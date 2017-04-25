'use strict';
/*
 Module panel_editAction is a dialog for adding or editing an action for dialplans
 Author: Marco Studerus
 */
angular.module('rocketvoip.panel_editAction', ['angular.filter'])
    .controller('PanelActionDialogCtrl', ['$scope', 'mdPanelRef', 'action', 'UtilityService', 'SipClientService',
        'callbackUpdate', 'callbackDelete', 'ActionIdService',
        function ($scope, mdPanelRef, action, UtilityService, SipClientService, callbackUpdate, callbackDelete, ActionIdService) {
            $scope.types = [
                {name: 'Dial', text: 'Team'},
                {name: 'SayAlpha', text: 'Voice Message'}
            ];

            $scope.closeDialog = function () {
                mdPanelRef && mdPanelRef.close();
            };

            $scope.saveAction = function () {
                if ($scope.actionEditForm.$valid) {
                    callbackUpdate($scope.action);
                    $scope.closeDialog();
                } else {
                    UtilityService.setAllFieldsTouched($scope.actionEditForm);
                }
            };

            $scope.deleteAction = function () {
                if (!($scope.isNewDialplan)) {
                    callbackDelete($scope.action);
                    $scope.closeDialog();
                }
            };

            $scope.initType = function () {
                //Generate Temporary ID for Action. The backend will ignore this property.
                $scope.action.id = ActionIdService.getUniqueId();

                if ($scope.action.type === "Dial") {
                    $scope.sipClients = SipClientService.query();
                    $scope.action.typeSpecific = {
                        ringingTime: 15,
                        sipClients: []
                    };
                }

                if ($scope.action.type === "SayAlpha") {
                    $scope.action.typeSpecific = {
                        sleepTime: 3
                    };
                }
            };

            $scope.action = angular.copy(action);
            if (action && action.name) {
                $scope.nameCopy = angular.copy(action.name);
                $scope.isNewDialplan = false;

            } else {
                $scope.isNewDialplan = true;
                $scope.action = {};
            }
        }
    ]).service("ActionIdService", function () {
    var nextId = 1;
    this.getUniqueId = function () {
        return nextId++;
    }
});
