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

    .controller('ViewEditDialplanCtrl', ['$scope', 'DialplanService', 'UtilityService', 'CompanyService', '$routeParams', '$location',
        function ($scope, DialplanService, UtilityService, CompanyService, $routeParams, $location) {
            if ($routeParams.id) {
                var dialplanID = $routeParams.id;
                if (isNaN(dialplanID)) {
                    $location.path('/view_dialplans/');
                }
                $scope.isNewDialplan = false;
                //TODO: Errorhandling
                //$scope.dialplan = DialplanService.get({id: dialplanID});
                $scope.dialplan = {
                    id: 55,
                    name: 'Test Dialplan',
                    actions: []
                };

                $scope.actions = [
                    {id: 3, name: 'Test 1'}, {id: 4, name: 'Test 2'}, {id: 5, name: 'Gugus4'}, {
                        id: 6,
                        name: 'Gugus5'
                    }, {id: 7, name: 'Gugus6'}];
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

            $scope.delete = function (action) {
                //TODO
                console.log('Delete: ' + action);
            };

            $scope.edit = function (action) {
                //TODO
                console.log('Edit: ' + action);
            };

        }]);