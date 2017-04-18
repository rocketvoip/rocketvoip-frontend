'use strict';
/*
 Module panel_edit is a dialog for adding oder editing a Sip Client
 Author: Marco Studerus
 */
angular.module('rocketvoip.panel_editUser', ['ngMessages'])
    .controller('PanelEditSipClientDialogCtrl', ['$scope', 'mdPanelRef', 'sipClient','company', 'appConfig',
        'SipClientService','UtilityService',
        function ($scope, mdPanelRef, sipClient, company, appConfig, SipClientService,UtilityService) {

            this.closeDialog = function() {
                mdPanelRef && mdPanelRef.close();
            };

            this.saveSipClient = function () {
                if ($scope.userEditForm.$valid) {
                    if ($scope.sipClient.id == undefined) {
                        $scope.sipClient.company = company;
                        SipClientService.save($scope.sipClient).$promise.then(this.closeDialog);
                    } else {
                        SipClientService.update($scope.sipClient).$promise.then(this.closeDialog);
                    }

                } else {
                    UtilityService.setAllFieldsTouched($scope.userEditForm);
                }
            };

            this.deleteSipClient = function () {
                if ($scope.sipClient.id) {
                    SipClientService.delete($scope.sipClient).$promise.then(this.closeDialog);
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

            if ($scope.sipClient == null) {
                $scope.isNewSipClient = true;
            } else {
                $scope.sipClientNameCopy = angular.copy(sipClient.name);
                $scope.isNewSipClient = false;
            }
        }]);