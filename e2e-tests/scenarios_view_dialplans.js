'use strict';

describe('rocketvoip', function () {

    describe('view_users', function () {

        beforeEach(function () {
            browser.get('index.html');

            var mockFunction = function () {
                angular.module('httpBackendMock', ['ngMockE2E'])
                    .run(function ($httpBackend) {
                        var testCompany = {id: 1, name: 'test1'};
                        var testDialplans = [];
                        var nextId = 0;
                        $httpBackend.whenGET(/\/sipclients/).respond(function () {
                            return [200, [
                                {
                                    id: 1,
                                    name: 'Marco Studerus',
                                    phone: "+41223334455",
                                    company: testCompany
                                },
                                {
                                    id: 2,
                                    name: 'Martin Wittwer',
                                    phone: "+41223334455",
                                    company: testCompany
                                }], {}];
                        });
                        $httpBackend.whenGET(/\/companies/).respond(function () {
                            return [200, [testCompany, {id: 99, name: 'test2'}], {}];
                        });
                        $httpBackend.whenGET(/\/dialplans/).respond(function () {
                            return [200, testDialplans , {}];
                        });
                        $httpBackend.whenPOST(/\/dialplans/).respond(function (method, url, data) {
                            var dialplan = angular.fromJson(data);
                            dialplan.id = ++nextId;
                            testDialplans.push(dialplan);
                            return [200, dialplan, {}];
                        });
                        $httpBackend.whenPUT(/\/dialplans\//).respond(function (method, url, data) {
                            var updateDialplan = angular.fromJson(data);
                            angular.forEach(testDialplans, function (dialplan, key) {
                                if (dialplan.id == updateDialplan.id) {
                                    testDialplans[key] = updateDialplan;
                                }
                            });
                            return [200, updateDialplan, {}];
                        });
                        $httpBackend.whenDELETE(/\/dialplans/).respond(function (method, url) {
                            var split = url.split("/")
                            var id = split[split.length - 1].split("?")[0]
                            for (var i = testDialplans.length - 1; i >= 0; i--) {
                                if (testDialplans[i].id == id) {
                                    testDialplans.splice(i, 1);
                                }
                            }
                            return [200, {}, {}];
                        });
                        $httpBackend.whenPOST(/login/).respond(function () {
                            return [200, {}, {'X-Auth-Token': 'Test-Token'}];
                        });
                        $httpBackend.whenGET(/.*/).passThrough();
                    });
            };
            browser.addMockModule('httpBackendMock', mockFunction);

            browser.driver.isElementPresent(by.id('username')).then(function (isPresent) {
                if (isPresent) {
                    element(by.id('username')).clear().sendKeys("test@test.ch");
                    element(by.id('password')).clear().sendKeys("password");
                    element(by.id('viewLoginForm-login')).click();
                }
            });
            browser.get('index.html#!/view_dialplans');
        });


        it('should load companies', function () {
            expect(element.all(by.tagName('md-option')).count()).toBe(2);
        });

    });
});
