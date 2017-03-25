'use strict';
/*
 Module panel_edit is a dialog for adding oder editing a Sip Client
 Author: Marco Studerus
 */
angular.module('rocketvoip.panel_editUser', [])
    .controller('PanelDialogCtrl', ['$scope', 'mdPanelRef', 'sipClient', 'updateSipClient', 'appConfig', 'SipClientService',
        function ($scope, mdPanelRef, sipClient, updateSipClient, appConfig, SipClientService) {

            this.closeDialog = function () {
                mdPanelRef.close().then(function () {
                    mdPanelRef.destroy();
                });
            };

            this.setPlaneTitle = function () {
                if ($scope.sipClient == null) {
                    $scope.title = "Add a new User"
                } else {
                    $scope.title = "Edit User '" + $scope.sipClient.name + "'";
                }
            };

            this.saveSipClient = function () {
                if ($scope.userEditForm.$valid) {
                    var callback = function (sipClient) {
                        updateSipClient(sipClient);
                    };
                    if ($scope.sipClient.id == undefined) {
                        SipClientService.save($scope.sipClient).$promise.then(callback);
                        this.closeDialog();
                    } else {
                        SipClientService.update($scope.sipClient).$promise.then(callback);
                        this.closeDialog();
                    }

                } else {
                    angular.forEach($scope.userEditForm.$error, function (field) {
                        angular.forEach(field, function (errorField) {
                            errorField.$setTouched();
                        });
                    });
                }
            };

            this.generateSecret = function () {
                var characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
                    's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7',
                    '8', '9'];
                var secret = [];
                for (var i = 0; i < appConfig.PASSWORD_LENGTH; i++) {
                    secret.push(characters[Math.floor(Math.random() * characters.length)]);
                }
                return secret.join('');
            };

            $scope.sipClient = angular.copy(sipClient);
            this.setPlaneTitle();

        }]);