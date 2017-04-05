'use strict';
/*
 Module panel_edit is a dialog for adding or editing a company
 Author: Martin Wittwer
 */
angular.module('rocketvoip.panel_editCompany', [])
    .controller('PanelCompanyDialogCtrl', ['$scope', 'mdPanelRef', 'company', 'appConfig',
        'CompanyService','UtilityService',
        function ($scope, mdPanelRef, company, appConfig, CompanyService,UtilityService) {
            this.closeDialog = function() {
                mdPanelRef && mdPanelRef.close();
            };
            
            this.setPlaneTitle = function () {
                if ($scope.company == null) {
                    $scope.title = "Add a new Company";
                    $scope.isNewCompany = true;
                } else {
                    $scope.title = "Edit Company '"+$scope.company.name +"'";
                    $scope.isNewCompany = false;
                }
            };

            this.saveCompany = function() {
                if($scope.companyEditForm.$valid) {
                    if($scope.company.id == undefined) {
                        CompanyService.save($scope.company).$promise.then(this.closeDialog);
                    } else {
                        CompanyService.update($scope.company).$promise.then(this.closeDialog);
                    }
                } else {
                    UtilityService.setAllFieldsTouched($scope.companyEditForm);
                }
            };

            this.deleteCompany = function () {
                if ($scope.company.id != null) {
                    CompanyService.delete($scope.company).$promise.then(this.closeDialog);
                }
            };

            $scope.company = angular.copy(company);
            this.setPlaneTitle();
        }
    ]);