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
        '$routeParams', '$location', 'ActionService',
        function ($scope, DialplanService, UtilityService, CompanyService, $routeParams, $location, ActionService) {
            var ctrl = this;

            this.query = function () {
                //TODO: Filter by company!
                $scope.dialplan = DialplanService.get({id: dialplanID});
                $scope.actions = ActionService.query();

                $scope.dialplan = {
                    id: 55,
                    name: 'Test Dialplan',
                    actions: [],
                    company: {name: "test", id: 10}
                };

                $scope.actions = [
                    {id: 3, name: 'Test 1', type: 'VOICE_MESSAGE', company: {name: "test", id: 10}}, {
                        id: 4,
                        name: 'Test 2',
                        type: 'VOICE_MESSAGE',
                        company: {name: "test", id: 10}
                    },
                    {id: 5, name: 'Gugus4', type: 'VOICE_MESSAGE', company: {name: "test", id: 10}}, {
                        id: 6,
                        name: 'Gugus5',
                        type: 'VOICE_MESSAGE',
                        company: {name: "test", id: 10}
                    },
                    {id: 7, name: 'Team Sales', type: 'TEAM', company: {name: "test", id: 10}, team: []}];
            };

            if ($routeParams.id) {
                var dialplanID = $routeParams.id;
                if (isNaN(dialplanID)) {
                    $location.path('/view_dialplans/');
                }
                $scope.isNewDialplan = false;
                this.query()
            } else {
                $scope.isNewDialplan = true;
            }

            $scope.moveSelectedActions = function (from, to) {
                for (var i = 0; i < from.length; i++) {
                    if (from[i].selected) {
                        from[i].selected = false;
                        to.push(from[i]);
                        from.splice(i, 1);
                        i--;
                    }
                }
            };


            //TODO: Refactor!
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
                        'company': $scope.dialplan.company
                    },
                    ctrl.queryCompanies);
            };

        }]);