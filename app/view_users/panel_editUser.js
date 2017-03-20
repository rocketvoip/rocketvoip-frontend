'use strict';

angular.module('rocketvoip.panel_editUser', [])
    .controller('PanelDialogCtrl', ['$scope', 'mdPanelRef', 'user', 'updateUser', 'appConfig', function ($scope, mdPanelRef, user, updateUser, appConfig) {

        this.closeDialog = function () {
            mdPanelRef.close().then(function () {
                mdPanelRef.destroy();
            });
        };

        this.setPlaneTitle = function () {
            if ($scope.user == null) {
                $scope.title = "Add a new User"
            } else {
                $scope.title = "Edit User '" + $scope.user.name + "'";
            }
        };

        this.saveUser = function () {
            if ($scope.userEditForm.$valid) {
                //TODO: Persist User
                if ($scope.user.id == undefined) {
                    //TODO: Set ID of User
                    $scope.user.id = Math.random() * (55555); //For Demo
                }
                updateUser($scope.user);

                this.closeDialog();
            } else {
                angular.forEach($scope.userEditForm.$error, function (field) {
                    angular.forEach(field, function (errorField) {
                        errorField.$setTouched();
                    });
                });
            }
        };

        this.generatePassword = function () {
            var lowerCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
                upperCharacters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
                numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
            var finalCharacters = lowerCharacters.concat(upperCharacters).concat(numbers);
            var finalPassword = [];
            for (var i = 0; i < appConfig.PASSWORD_LENGTH; i++) {
                finalPassword.push(finalCharacters[Math.floor(Math.random() * finalCharacters.length)]);
            }
            return finalPassword.join('');
        };

        $scope.user = angular.copy(user);
        this.setPlaneTitle();

    }]);