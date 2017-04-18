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
        var deleteSipClientSpy;

        beforeEach(inject(function ($rootScope, $controller, $templateCache, $compile, $q) {
            testSipClient = {id: 1, name: 'MarcoStuderus', phone: "+41710000000", secret: "12345678"};
            $q = $q;
            deferred = $q.defer();

            var callbackNgResource = function (sipClient) {
                var ret = {};
                deferred.resolve(sipClient);
                ret.$promise = deferred.promise;
                return ret;
            };

            SipClientServiceMock = {
                save: function (sipClient) {
                    sipClient.id = nextID++;
                    return callbackNgResource(sipClient);
                },
                update: function (sipClient) {
                    deferred.resolve(sipClient);
                    return callbackNgResource(sipClient);
                },
                delete: function (sipClient) {
                    deferred.resolve(sipClient);
                    return callbackNgResource(sipClient);
                }

            };

            scope = $rootScope.$new();
            _mdPanelRef = {};
            _mdPanelRef.close = jasmine.createSpy().and.callFake(function () {
                return {
                    then: function (callback) {
                        return callback();
                    }
                };
            });

            _appConfig = {
                "PASSWORD_LENGTH": 11
            };

            panelDialogCtrl = $controller("PanelDialogCtrl", {
                $scope: scope,
                mdPanelRef: _mdPanelRef,
                sipClient: null,
                updateSipClient: updateSipClientSpy,
                deleteSipClient: deleteSipClientSpy,
                appConfig: _appConfig,
                SipClientService: SipClientServiceMock,
                company: {
                    id: 5,
                    name: "UnitTestAG"
                }
            });

            var templateHtml = $templateCache.get('view_users/panel_editUser.html');
            var formElement = angular.element(templateHtml);
            $compile(formElement)(scope);
            scope.$apply()
        }));

        it('should be Defined', inject(function () {
            expect(panelDialogCtrl).toBeDefined();
        }));

        it('should set isNewSipClient to true', inject(function () {
            expect(scope.isNewSipClient).toBeTruthy();

        }));

        it('should set isNewSipClient to false"', inject(function ($controller) {
            panelDialogCtrl = $controller("PanelDialogCtrl", {
                $scope: scope,
                mdPanelRef: _mdPanelRef,
                sipClient: testSipClient,
                updateSipClient: {},
                deleteSipClient: {},
                company: {
                    id: 5,
                    name: "UnitTestAG"
                }
            });
            expect(scope.isNewSipClient).toBeFalsy();
        }));

        it('should set id of new sip client', inject(function () {
            scope.sipClient = {name: 'MarcoStuderus', phone: "+41223334455", secret: "12345678"};
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

        it('should call mdPanelRef.close() on delete (edit sip client)', inject(function () {
            scope.sipClient = {id: 1, name: 'MarcoStuderus', phone: "+41710000000", secret: "12345678"};
            scope.$apply();
            panelDialogCtrl.deleteSipClient();
            scope.$apply();
            expect(_mdPanelRef.close).toHaveBeenCalled();
        }));

        it('should not delete & close sip client when id is not defined', inject(function () {
            scope.sipClient = {name: "Marco", phone: "+41223334455", secret: "12345678"};
            scope.$apply();
            panelDialogCtrl.deleteSipClient();
            scope.$apply();
            expect(_mdPanelRef.close).toHaveBeenCalledTimes(0);
        }));

        it('should not close sip client when name is empty', inject(function () {
            scope.sipClient = {id: 1, phone: "+41223334455", secret: "12345678"};
            scope.$apply();
            panelDialogCtrl.saveSipClient();
            scope.$apply();
            expect(_mdPanelRef.close).toHaveBeenCalledTimes(0);
        }));

        it('should not close sip client when phone is empty', inject(function () {
            scope.sipClient = {id: 1, name: 'MarcoStuderus', secret: "12345678"};
            scope.$apply();
            panelDialogCtrl.saveSipClient();
            scope.$apply();
            expect(_mdPanelRef.close).toHaveBeenCalledTimes(0);
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