'use strict';
describe('rocketvoip.view_editDialplan module', function () {

    beforeEach(module('rocketvoip.view_editDialplan'));
    beforeEach(module('rocketvoip'));

    describe('view_editDialplan controller', function () {
        var scope, ctrl, location, controller, testData, UtilityService, DialplanService, q, deferred, callbackNgResource;

        beforeEach(inject(function ($rootScope, $controller, appConfig, $q) {
            q = $q;
            deferred = $q.defer();

            callbackNgResource = function (obj) {
                var ret = {};
                deferred.resolve(obj);
                ret.$promise = deferred.promise;
                return ret;
            };

            DialplanService = {
                get: function () {
                    return testData.dialplan;
                },
                delete: jasmine.createSpy(),
                save: function (data) {
                    data.id = 4;
                    return callbackNgResource(data);
                },
                update: function (data) {
                    return callbackNgResource(data);
                }
            };

            testData = {};

            testData.actionDial = {
                "name": "Test-Name-1",
                "type": "Dial",
                "typeSpecific": {
                    "ringingTime": "15",
                    "sipClients": [{
                        "name": "aSIPClient",
                        "phone": "5345",
                        "secret": "test",
                        "id": 1,
                        "company": {"name": "firstCompany", "id": 1}
                    }]
                }
            };

            testData.actionSayAlpha = {
                "name": "SayAlphaTest",
                "type": "SayAlpha",
                "typeSpecific": {"voiceMessage": "Message", "sleepTime": 5}
            };

            testData.dialplan = {
                name: "Testname",
                id: 4,
                phone: 555,
                actions: [testData.actionDial, testData.actionSayAlpha]
            };

            location = {
                path: jasmine.createSpy(),
                search: jasmine.createSpy().and.returnValue({
                    params: {
                        companyID: 4,
                        companyName: 'TestCompany'
                    }
                })
            };

            UtilityService = {
                "showDialog": jasmine.createSpy(),
                "showToast": jasmine.createSpy()
            };

            scope = $rootScope.$new();
            controller = $controller;
            ctrl = $controller("ViewEditDialplanCtrl", {
                $scope: scope,
                appConfig: appConfig,
                $location: location,
                UtilityService: UtilityService,
                DialplanService: DialplanService
            });
        }));

        it('should be Defined', inject(function () {
            expect(ctrl).toBeDefined();
        }));

        it('should remove action', inject(function () {
            scope.dialplan.actions = [testData.actionDial, testData.actionSayAlpha];
            ctrl.deleteAction(testData.actionDial);
            expect(scope.dialplan.actions.length).toBe(1);
        }));

        it('should redirect on close', inject(function () {
            scope.closeDialplan();
            expect(location.path).toHaveBeenCalled();
        }));

        it('should open dialog on edit', inject(function () {
            scope.edit();
            expect(UtilityService.showDialog).toHaveBeenCalled();
        }));

        it('should load dialplan', inject(function () {
            ctrl.query();
            scope.$apply();
            expect(scope.dialplan.name).toEqual(testData.dialplan.name);
            var action = scope.dialplan.actions[0];
        }));

        it('should not delete new dialplan', inject(function () {
            scope.deleteDialplan();
            expect(DialplanService.delete).toHaveBeenCalledTimes(0);
        }));

        it('should delete existing dialplan', inject(function () {
            scope.isNewDialplan = false;
            scope.deleteDialplan();
            expect(DialplanService.delete).toHaveBeenCalledTimes(1);
        }));

        it('should update action', inject(function () {
            ctrl.createAction(testData.actionSayAlpha);
            ctrl.createAction(testData.actionDial);
            expect(scope.dialplan.actions.length).toBe(2);
            var copy = angular.copy(testData.actionDial);
            copy.name = "Changed name";
            ctrl.updateAction(copy);
            var action = scope.dialplan.actions;
            expect(action[1].name).toEqual(copy.name);
            expect(scope.dialplan.actions.length).toBe(2);
        }));

        it('should swap actions', inject(function () {
            ctrl.createAction(testData.actionSayAlpha);
            ctrl.createAction(testData.actionDial);
            var action = scope.dialplan.actions;
            expect(action[0].name).toEqual(testData.actionSayAlpha.name);
            expect(action[1].name).toEqual(testData.actionDial.name);
            scope.swap(action[1], -1);
            action = scope.dialplan.actions;
            expect(action[0].name).toEqual(testData.actionDial.name);
            expect(action[1].name).toEqual(testData.actionSayAlpha.name);
        }));

        it('should not swap actions if action not exists', inject(function () {
            ctrl.createAction(testData.actionSayAlpha);
            ctrl.createAction(testData.actionDial);
            var action = scope.dialplan.actions;
            expect(action[0].name).toEqual(testData.actionSayAlpha.name);
            expect(action[1].name).toEqual(testData.actionDial.name);
            scope.swap({}, -1);
            action = scope.dialplan.actions;
            expect(action[0].name).toEqual(testData.actionSayAlpha.name);
            expect(action[1].name).toEqual(testData.actionDial.name);
        }));

        it('should POST on new dialplan', inject(function () {
            delete scope.dialplan.id;
            scope.dialplan.name = "Test-Name";
            scope.$apply();
            ctrl.updateAction(testData.actionSayAlpha);
            scope.saveDialplan();
            expect(scope.dialplan.id).toBeDefined();
        }));

        it('should PUT on existing dialplan', inject(function () {

            spyOn(DialplanService, 'update').and.callThrough();
            deferred = q.defer();
            scope.dialplan.id = 5;
            scope.dialplan.name = "Test-Name";
            scope.saveDialplan();
            scope.$apply();
            expect(DialplanService.update).toHaveBeenCalled();
            expect(UtilityService.showToast).toHaveBeenCalled();
        }));

        it('should should redirect when route is invalid', inject(function () {
            var routeParams = {
                id: 'NotANumber'
            };
            ctrl = controller("ViewEditDialplanCtrl", {
                $scope: scope,
                $location: location,
                UtilityService: UtilityService,
                DialplanService: DialplanService,
                $routeParams: routeParams
            });
            expect(location.path).toHaveBeenCalled();
        }));

        it('should load existing dialplan', inject(function () {
            location.path = jasmine.createSpy();
            var routeParams = {
                id: 1
            };
            ctrl = controller("ViewEditDialplanCtrl", {
                $scope: scope,
                $location: location,
                UtilityService: UtilityService,
                DialplanService: DialplanService,
                $routeParams: routeParams
            });
            expect(location.path).toHaveBeenCalledTimes(0);
            expect(scope.isNewDialplan).toBeFalsy();
        }));

        it('should should not redirect when parameters are set', inject(function () {
            location.path = jasmine.createSpy();
            location.search = function(){
                return {
                        companyID: 2,
                        companyName: "TestAG"
                }
            };
            ctrl = controller("ViewEditDialplanCtrl", {
                $scope: scope,
                $location: location,
                UtilityService: UtilityService,
                DialplanService: DialplanService
            });
            expect(scope.isNewDialplan).toBeTruthy();
            expect(location.path).toHaveBeenCalledTimes(0);
        }));

        it('should set position of action', inject(function () {
            var existingAction = {
                name: "Test"
            };
            scope.edit(existingAction,1);
            expect(existingAction.position).toBe(1);

        }));

    });
});