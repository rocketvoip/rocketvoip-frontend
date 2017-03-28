/*
 Service for Utility Functions
 Author: Marco Studerus
 */
'use strict';
angular.module('rocketvoip.utility_service', [])
    .factory('UtilityService', function Service($mdToast) {
        return {
            showToast: function(message) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(message)
                        .hideDelay(3000)
                );
            }
        };
    });