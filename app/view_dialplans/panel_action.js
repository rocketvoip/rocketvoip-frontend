'use strict';
/*
 Module panel_editAction is a dialog for adding or editing an action for dialplans
 Author: Marco Studerus
 */
angular.module('rocketvoip.panel_editAction', ['angular.filter'])
    .controller('PanelActionDialogCtrl', ['$scope', 'mdPanelRef', 'action', 'UtilityService', 'SipClientService',
        'callbackUpdate', 'callbackDelete', 'rfc4122',
        function ($scope, mdPanelRef, action, UtilityService, SipClientService, callbackUpdate, callbackDelete, rfc4122) {
            $scope.types = [
                {name: 'TEAM', text: 'Team'},
                {name: 'VOICE_MESSAGE', text: 'Voice Message'}
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
                if ($scope.action.type === "TEAM") {
                    $scope.sipClients = SipClientService.query();
                }
            };

            $scope.action = angular.copy(action);
            if (action && action.name) {
                $scope.nameCopy = angular.copy(action.name);
                $scope.isNewDialplan = false;

            } else {
                $scope.isNewDialplan = true;
                $scope.action = {
                    team: [],
                    uuid: rfc4122.v4()
                };
            }

            $scope.initType();
        }
    ]);
