'use strict';
/*
 Module panel_editAction is a dialog for adding or editing an action for dialplans
 Author: Marco Studerus
 */
angular.module('rocketvoip.panel_editAction', ['angular.filter'])
    .controller('PanelActionDialogCtrl', function ($scope, mdPanelRef, action, UtilityService, SipClientService,
                                                   callbackAction, ActionIdService, DialplanService) {
            $scope.types = [
                {name: 'Dial', text: 'Ring', description: '(rings on multiple phones)'},
                {name: 'SayAlpha', text: 'Voice Message', description: '(reads a message aloud)'},
                {name: 'Goto', text: 'Goto', description: '(forwards to another dialplan)'},
                {name: 'Branch', text: 'Branch', description: '(forwards to another dialplan depending on the input )'}
            ];

            $scope.closeDialog = function () {
                mdPanelRef && mdPanelRef.close();
            };

            $scope.saveAction = function () {
                if ($scope.actionEditForm.$valid) {
                    if ($scope.action.type === "Branch") {
                        var options = $scope.action.typeSpecific.nextDialPlanIds;
                        if (options[options.length - 1] == undefined) {
                            options.pop();
                        }
                    }

                    if ($scope.isNewDialplan) {
                        callbackAction.create($scope.action);
                    } else {
                        callbackAction.update($scope.action);
                    }
                    $scope.closeDialog();
                } else {
                    UtilityService.setAllFieldsTouched($scope.actionEditForm);
                }
            };

            $scope.deleteAction = function () {
                if (!($scope.isNewDialplan)) {
                    callbackAction.delete($scope.action);
                    $scope.closeDialog();
                }
            };

            $scope.initType = function () {
                //Generate Temporary ID for Action. The backend will ignore this property.
                $scope.action.id = ActionIdService.getUniqueId();

                if ($scope.action.type === "Dial") {
                    $scope.loadData();
                    $scope.action.typeSpecific = {
                        ringingTime: 15,
                        sipClients: []
                    };
                }
                else if ($scope.action.type === "SayAlpha") {
                    $scope.action.typeSpecific = {
                        sleepTime: 3
                    };
                }
                else if ($scope.action.type === "Goto") {
                    $scope.loadData();
                    $scope.action.typeSpecific = {
                        nextDialPlanId: {}
                    };
                }
                else if ($scope.action.type === "Branch") {
                    $scope.loadData();
                    $scope.action.typeSpecific = {
                        nextDialPlanIds: [undefined],
                        hangupTime: 15
                    };
                }
            };

            $scope.loadData = function () {
                $scope.dialplans = DialplanService.query();
                $scope.sipClients = SipClientService.query();
            };

            $scope.deleteBranchOption = function (index) {
                $scope.action.typeSpecific.nextDialPlanIds.splice(index, 1);
            };

            $scope.branchOptionChange = function () {
                var options = $scope.action.typeSpecific.nextDialPlanIds;
                if (options[options.length - 1]) {
                    addEmptyBranchOption();
                }
            };

            function addEmptyBranchOption() {
                var options = $scope.action.typeSpecific.nextDialPlanIds;
                if (options.length < 9) {
                    options.push(undefined);
                }
            }

            $scope.loadData();

            $scope.action = angular.copy(action);
            if (action && action.name) {
                $scope.nameCopy = angular.copy(action.name);
                $scope.isNewDialplan = false;
                if ($scope.action.type === "Branch") {
                    addEmptyBranchOption()
                }

            } else {
                $scope.isNewDialplan = true;
                $scope.action = {};
            }
        }
    ).service("ActionIdService", function () {
    this.getUniqueId = function () {
        return Math.floor(Math.random() * (20000 - 1000 + 1));
    };
});
