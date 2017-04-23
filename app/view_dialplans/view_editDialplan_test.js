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
                delete obj.uuid;
                deferred.resolve(obj);
                ret.$promise = deferred.promise;
                return ret;
            };

            DialplanService = {
                get: function () {
                    return callbackNgResource(testData.dialplan);
                }
            };


            testData = {};

            testData.actionDial = {
                "uuid": "111111",
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
                "uuid": "555555",
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
                path: jasmine.createSpy().and.returnValue({search: jasmine.createSpy()}),
                search: jasmine.createSpy().and.returnValue({
                    params: {
                        companyID: 4,
                        companyName: 'TestCompany'
                    }
                })
            };

            UtilityService = {
                "showDialog": jasmine.createSpy()
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

        it('should set uuid on load', inject(function () {
            ctrl.query();
            scope.$apply();
            var action = scope.dialplan.actions[0];
            expect(action.uuid.length).toBe(36);
        }));

    });
});