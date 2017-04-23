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

    .controller('ViewEditDialplanCtrl', ['$scope', 'DialplanService', 'UtilityService', 'CompanyService',
        '$routeParams', '$location','rfc4122',
        function ($scope, DialplanService, UtilityService, CompanyService, $routeParams, $location,rfc4122) {
            var ctrl = this;
            var dialplanID;

            this.query = function () {
                DialplanService.get({id: dialplanID}).$promise.then(function (dialplan) {
                    $scope.dialplan = dialplan;
                    angular.forEach($scope.dialplan.actions, function(action) {
                        action.uuid = rfc4122.v4();
                    });
                });
            };

            this.updateAction = function (updatedAction) {
                var found = 0;
                angular.forEach($scope.dialplan.actions, function (action, key) {
                    if (action.uuid == updatedAction.uuid) {
                        $scope.dialplan.actions[key] = updatedAction;
                        found = 1;
                    }
                });
                if (!found) {
                    $scope.dialplan.actions.push(updatedAction);
                }
            };

            this.deleteAction = function (deletedAction) {
                var actions = $scope.dialplan.actions;
                for (var i = actions.length - 1; i >= 0; i--) {
                    if (actions[i].uuid == deletedAction.uuid) {
                        actions.splice(i, 1);
                    }
                }
            };


            $scope.closeDialplan = function () {
                $location.search({});
                $location.path('/view_dialplans/');
            };

            $scope.saveDialplan = function () {
                var callback = function (dialplan) {
                    dialplanID = dialplan.id;
                    this.query();
                };

                if(!($scope.dialplan.id)) {
                    DialplanService.save($scope.dialplan).$promise.then(callback);
                }else{
                    DialplanService.update($scope.dialplan).$promise.then(callback);
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
                UtilityService.showDialog(
                    'PanelActionDialogCtrl',
                    'view_dialplans/panel_action.html',
                    'action-dialog',
                    {
                        'action': action,
                        'callbackUpdate': ctrl.updateAction,
                        'callbackDelete': ctrl.deleteAction
                    },
                    null);
            };

            if ($routeParams.id) {
                dialplanID = $routeParams.id;
                if (isNaN(dialplanID)) {
                    $location.path('/view_dialplans/');
                }
                $scope.isNewDialplan = false;
                this.query()
            } else {
                $scope.isNewDialplan = true;
                $scope.dialplan = {
                    actions: []
                };
                var params = $location.search();

                if (!(params && params.companyID && params.companyName)) {
                    $location.search({});
                    $location.path('/view_dialplans/');
                }

                $scope.dialplan.company = {
                    id: params.companyID,
                    name: params.companyName
                }

            }

        }]);