'use strict';
/*
 Module View Edit Dialplan
 Author: Marco Studerus
 */
angular.module('rocketvoip.view_editDialplan', ['ngRoute', 'ngResource'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view_editDialplan/:id?', {
            templateUrl: 'view_dialplans/view_editDialplan.html',
            controller: 'ViewEditDialplanCtrl'
        });
    }])

    .controller('ViewEditDialplanCtrl',
        function ($scope, DialplanService, UtilityService, CompanyService, $routeParams, $location, $filter) {
            var ctrl = this;
            var dialplanID;

            function findAction(find) {
                return $filter('filter')($scope.dialplan.actions, function (action) {
                    return action.id === find.id;
                })[0];
            }

            function getIndexOfAction(find) {
                var action = findAction(find);
                return $scope.dialplan.actions.indexOf(action);
            }

            function isValidRoute() {
                return typeof($routeParams.id) == 'undefined' || !isNaN($routeParams.id);
            }

            function initializeExistingDialplan() {
                dialplanID = $routeParams.id;
                $scope.isNewDialplan = false;
                ctrl.query()
            }

            function isValidParameter(params) {
                return typeof(params) !== 'undefined' && typeof(params.companyID) !== 'undefined' &&
                    typeof(params.companyName) !== 'undefined';
            }

            function redirectToViewDialplans() {
                $location.search({});
                $location.path('/view_dialplans/');
            }

            function initializeNewDialplan() {
                $scope.isNewDialplan = true;
                $scope.dialplan = {
                    actions: []
                };
                var params = $location.search();

                if (isValidParameter(params)) {
                    $scope.dialplan.company = {
                        id: params.companyID,
                        name: params.companyName
                    }
                } else {
                    redirectToViewDialplans();
                }
            }

            function initialize() {
                if (!isValidRoute()) {
                    redirectToViewDialplans();
                } else if ($routeParams.id) {
                    initializeExistingDialplan();
                } else {
                    initializeNewDialplan();
                }
            }

            this.query = function () {
                //TODO: If not exists (404) redirect!
                $scope.dialplan = DialplanService.get({id: dialplanID});
            };

            this.updateAction = function (action) {
                var index = getIndexOfAction(action);
                $scope.dialplan.actions[index] = action;
            };

            this.createAction = function (action) {
                $scope.dialplan.actions.push(action);
                //TODO: Branch or Goto should be the last actions!
            };

            this.deleteAction = function (action) {
                $scope.dialplan.actions.splice(getIndexOfAction(action), 1);
            };

            $scope.closeDialplan = function () {
                redirectToViewDialplans();
            };

            $scope.saveDialplan = function () {
                var callback = function (dialplan) {
                    dialplanID = dialplan.id;
                    ctrl.query();
                    $scope.isNewDialplan = false;
                    UtilityService.showToast("Dialplan saved");
                };

                if (!($scope.dialplan.id)) {
                    DialplanService.save($scope.dialplan).$promise.then(callback);
                } else {
                    DialplanService.update($scope.dialplan).$promise.then(callback);
                }
            };

            $scope.deleteDialplan = function () {
                if (!($scope.isNewDialplan)) {
                    DialplanService.delete($scope.dialplan);
                    $scope.closeDialplan();
                }
            };

            $scope.swap = function (action, value) {
                var array = $scope.dialplan.actions;
                var oldIndex = array.indexOf(action);
                if (oldIndex > -1) {
                    var temp = array[oldIndex];
                    array[oldIndex] = array[oldIndex + value];
                    array[oldIndex + value] = temp;
                }
            };

            $scope.edit = function (action) {
                //TODO: Set next ID (ActionIdService.setNextUniqueId(int))
                UtilityService.showDialog(
                    'PanelActionDialogCtrl',
                    'view_dialplans/panel_action.html',
                    'action-dialog',
                    {
                        'action': action,
                        'callbackAction': {
                            "update": ctrl.updateAction,
                            "delete": ctrl.deleteAction,
                            "create": ctrl.createAction
                        }
                    },
                    null);
            };

            initialize();
        });