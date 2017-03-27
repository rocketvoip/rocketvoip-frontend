'use strict';

describe('rocketvoip.view_users module', function () {

    beforeEach(module('rocketvoip.panel_editUser'));
    beforeEach(module('ngMaterial'));
    beforeEach(module('view_users/panel_editUser.html'));
    beforeEach(module('rocketvoip'));

    describe('PanelDialog controller', function () {

        var scope;
        var panelDialogCtrl;
        var _mdPanelRef = {};
        var updateSipClientSpy;
        var testSipClient;
        var _appConfig;
        var SipClientServiceMock;
        var nextID = 1000;
        var $q;
        var deferred;

        beforeEach(inject(function ($rootScope, $controller, $templateCache, $compile,$q) {
            testSipClient = {id: 1, name: 'Marco Studerus', phone: "+41710000000", secret: "12345678"};
            $q = $q;
            deferred = $q.defer();

            SipClientServiceMock = {
                save: function(sipClient){
                    sipClient.id = nextID++;
                    var ret = {};
                    deferred.resolve(sipClient);
                    ret.$promise = deferred.promise;
                    return ret;
                },
                update: function(sipClient){
                    deferred.resolve(sipClient);
                    var ret = {};
                    deferred.resolve(sipClient);
                    ret.$promise = deferred.promise;
                    return ret;
                },
            }

            scope = $rootScope.$new();
            _mdPanelRef = {};
            _mdPanelRef.close = jasmine.createSpy().and.callFake(function () {
                return {
                    then: function (callback) {
                        return callback();
                    }
                };
            });
            _mdPanelRef.destroy = jasmine.createSpy();
            updateSipClientSpy = jasmine.createSpy();
            _appConfig = {
                "PASSWORD_LENGTH": 11
            };

            panelDialogCtrl = $controller("PanelDialogCtrl", {
                $scope: scope,
                mdPanelRef: _mdPanelRef,
                sipClient: null,
                updateSipClient: updateSipClientSpy,
                appConfig: _appConfig,
                SipClientService: SipClientServiceMock
            });

            var templateHtml = $templateCache.get('view_users/panel_editUser.html');
            var formElement = angular.element(templateHtml);
            $compile(formElement)(scope);
            scope.$apply()
        }));

        it('should be Defined', inject(function () {
            expect(panelDialogCtrl).toBeDefined();
        }));

        it('should set title of panel to "Add a new User"', inject(function () {
            panelDialogCtrl.setPlaneTitle();
            expect(scope.title).toEqual("Add a new User");
        }));

        it('should set title of panel to "Edit User"', inject(function ($controller) {
            panelDialogCtrl = $controller("PanelDialogCtrl", {
                $scope: scope,
                mdPanelRef: _mdPanelRef,
                sipClient: testSipClient,
                updateSipClient: {}
            });
            panelDialogCtrl.setPlaneTitle();
            expect(scope.title).toEqual("Edit User 'Marco Studerus'");
        }));

        it('should set id of new sip client', inject(function () {

            scope.sipClient = {name: 'Marco Studerus', phone: "+41223334455", secret: "12345678"};
            scope.$apply();
            panelDialogCtrl.saveSipClient();
            expect(scope.sipClient.id).toBeDefined();
        }));

        it('should not change id of existing sip client', inject(function () {

            scope.sipClient = testSipClient;
            scope.$apply();
            panelDialogCtrl.saveSipClient();
            expect(scope.sipClient.id).toBe(1);
        }));

        it('should call mdPanelRef.close() on save', inject(function () {
            scope.sipClient = testSipClient;
            scope.$apply();
            panelDialogCtrl.saveSipClient();
            scope.$apply();
            expect(_mdPanelRef.close).toHaveBeenCalled();
        }));

        it('should call mdPanelRef.destroy() on save', inject(function () {
            scope.sipClient = testSipClient;
            scope.$apply();
            panelDialogCtrl.saveSipClient();
            scope.$apply();
            expect(_mdPanelRef.destroy).toHaveBeenCalled();
        }));

        it('should call updateSipClient() on save (edit sip client)', inject(function () {
            scope.sipClient = testSipClient;
            scope.$apply();
            panelDialogCtrl.saveSipClient();
            scope.$apply();
            expect(updateSipClientSpy).toHaveBeenCalled();
        }));

        it('should call updateSipClient() on save (add sip client)', inject(function () {
            scope.sipClient = {name: 'Marco Studerus', phone: "+41710000000", secret: "12345678"};
            scope.$apply();
            panelDialogCtrl.saveSipClient();
            scope.$apply();
            expect(updateSipClientSpy).toHaveBeenCalled();
        }));


        it('should not save sip client when name is empty', inject(function () {
            scope.sipClient = {id: 1, phone: "+41223334455", secret: "12345678"};
            scope.$apply();
            panelDialogCtrl.saveSipClient();
            scope.$apply();
            expect(updateSipClientSpy).toHaveBeenCalledTimes(0);
        }));

        it('should not save sip client when phone is empty', inject(function () {
            scope.sipClient = {id: 1, name: 'Marco Studerus', secret: "12345678"};
            scope.$apply();
            panelDialogCtrl.saveSipClient();
            scope.$apply();
            expect(updateSipClientSpy).toHaveBeenCalledTimes(0);
        }));

        it('should not save sip client when sip client is null', inject(function () {
            scope.sipClient = null;
            panelDialogCtrl.closeDialog = jasmine.createSpy();
            scope.$apply();
            panelDialogCtrl.saveSipClient();
            scope.$apply();
            expect(panelDialogCtrl.closeDialog).toHaveBeenCalledTimes(0);
        }));

        it('should generate password', inject(function () {
            expect(panelDialogCtrl.generateSecret().length).toBe(_appConfig.PASSWORD_LENGTH);
        }));
    });
});