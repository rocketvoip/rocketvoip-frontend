'use strict';

angular.module('rocketvoip.view_users', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view_users', {
            templateUrl: 'view_users/view_users.html',
            controller: 'ViewUsersCtrl'
        });
    }])

    .controller('ViewUsersCtrl', ['$scope', '$mdPanel', function ($scope, $mdPanel) {
		
		$scope.sipUsers = [];

        $scope.sortType     = 'name';
        $scope.sortReverse  = false;

        this.updateUser = function (user) {
            if (typeof user !== 'undefined') {

                var found = false;
                $scope.sipUsers.some(function (sipUser) {
                    if (sipUser.id === user.id) {
                        sipUser.name = user.name;
                        sipUser.phone = user.phone;
                        found = true;
                        return true;
                    }
                });
                if (!found) {
                    $scope.sipUsers.push(user);
                }
            }
        };

        this.showDialog = function ($user) {
            var position = $mdPanel.newPanelPosition()
                .absolute()
                .center();
            var config = {
                attachTo: angular.element(document.body),
                controller: 'PanelDialogCtrl',
                controllerAs: 'ctrl',
                position: position,
                templateUrl: 'view_users/panel_editUser.html',
                hasBackdrop: true,
                panelClass: 'user-dialog',
                trapFocus: true,
                zIndex: 150,
                clickOutsideToClose: true,
                escapeToClose: true,
                locals: {
                    "user": $user,
                    "updateUser": this.updateUser
                },
                focusOnOpen: true
            };

            this._mdPanel = $mdPanel.create(config);
            this._mdPanel.open();
            return this._mdPanel;
        };
    }]);