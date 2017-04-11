'use strict';
/*
 Module panel_editAction is a dialog for adding or editing an action for dialplans
 Author: Marco Studerus
 */
angular.module('rocketvoip.panel_editAction', [])
    .controller('PanelActionDialogCtrl', ['$scope', 'mdPanelRef', 'action','ActionService',
        function ($scope, mdPanelRef, action, ActionService) {
            this.closeDialog = function() {
                mdPanelRef && mdPanelRef.close();
            };

            this.saveAction = function() {
                if($scope.editActionForm.$valid) {
                    if($scope.action.id == undefined) {
                        ActionService.save($scope.action).$promise.then(this.closeDialog);
                    } else {
                        ActionService.update($scope.action).$promise.then(this.closeDialog);
                    }
                } else {
                    ActionService.setAllFieldsTouched($scope.editActionForm);
                }
            };

            this.deleteAction = function () {
                if ($scope.action.id != null) {
                    ActionService.delete($scope.action).$promise.then(this.closeDialog);
                }
            };

            $scope.action = angular.copy(action);
            $scope.nameCopy = angular.copy(action.name);
        }
    ]);