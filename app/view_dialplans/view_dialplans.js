'use strict';
/*
 Module View Dialplan shows all dialplans
 Author: Marco Studerus
 */
angular.module('rocketvoip.view_dialplans', ['ngRoute', 'ngResource'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view_dialplans', {
            templateUrl: 'view_dialplans/view_dialplans.html',
            controller: 'ViewDialplansCtrl'
        });
    }])

    .controller('ViewDialplansCtrl', ['$scope', function ($scope) {

    }]);