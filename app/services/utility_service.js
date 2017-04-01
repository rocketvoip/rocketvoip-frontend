/*
 Service for Utility Functions
 Author: Marco Studerus, Martin Wittwer
 */
'use strict';
angular.module('rocketvoip.utility_service', [])
    .factory('UtilityService', function Service($mdToast,$mdPanel) {
        return {
            showToast: function(message) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(message)
                        .hideDelay(3000)
                );
            },
            showDialog: function (ctrl, templateUrl, panelClass, locals, callback) {
                var planePosition = $mdPanel.newPanelPosition().absolute().center();

                var planeConfig = {
                    attachTo: angular.element(document.body),
                    controller: ctrl,
                    controllerAs: 'ctrl',
                    position: planePosition,
                    templateUrl: templateUrl,
                    hasBackdrop: true,
                    panelClass: panelClass,
                    trapFocus: true,
                    zIndex: 150,
                    clickOutsideToClose: true,
                    escapeToClose: true,
                    locals: locals,
                    focusOnOpen: true,
                    onRemoving: callback
                };

                var _mdPanel = $mdPanel.create(planeConfig);
                _mdPanel.open();
                return _mdPanel;
            }
        };
    });