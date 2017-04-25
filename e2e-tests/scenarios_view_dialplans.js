'use strict';

describe('rocketvoip', function () {

    describe('view_users', function () {

        var actionSayAlpha, actionDial;

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
                        $httpBackend.whenGET(/\/dialplans\//).respond(function (method, url) {
                            var split = url.split("/");
                            var id = split[split.length - 1];
                            var returnDialplan = {};
                            angular.forEach(testDialplans, function (dialplan, key) {
                                if (dialplan.id == id) {
                                    returnDialplan = testDialplans[key];
                                }
                            });
                            return [200, returnDialplan, {}];

                        });
                        $httpBackend.whenGET(/\/dialplans/).respond(function () {
                            return [200, testDialplans, {}];
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
                            var split = url.split("/");
                            var id = split[split.length - 1].split("?")[0];
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

            actionSayAlpha = {
                name: "Test-Action-01",
                message: "Hello World!",
                sleepTime: 10
            };

            actionDial = {
                name: "Test-Action-02",
                ringingTime: "10",
                sipClients: ['Marco Studerus', 'Martin Witt']
            };

            browser.get('index.html#!/view_dialplans');
        });


        it('should load companies', function () {
            expect(element.all(by.tagName('md-option')).count()).toBe(2);
        });

        it('should redirect when adding new dialplan', function () {
            element.all(by.className('view-dialplan-add-dialplan')).first().click();
            expect(browser.getLocationAbsUrl()).toEqual('/view_editDialplan/?companyID=1&companyName=test1');
        });

        it('should redirect from view_editDialplan to view_dialplan', function () {
            element.all(by.className('view-dialplan-add-dialplan')).first().click();
            element.all(by.id('button-close-dialplan')).first().click();
            expect(browser.getLocationAbsUrl()).toEqual('/view_dialplans');
        });

        it('should not show delete button for new dialplans', function () {
            element.all(by.className('view-dialplan-add-dialplan')).first().click();
            expect(element(by.css('.button-delete-dialplan')).isPresent()).toBeFalsy();
        });

        function addActionSayAlpha(action) {
            element(by.id('view-editDialplan-add-action')).click();
            element(by.model('action.name')).clear().sendKeys(action.name);
            element(by.tagName('md-select')).click();
            element.all(by.css('.md-select-menu-container.md-active md-option')).last().click();
            element(by.model('action.typeSpecific.voiceMessage')).clear().sendKeys(action.message);
            element(by.model('action.typeSpecific.sleepTime')).clear().sendKeys(action.sleepTime);
            element(by.id('plane-editAction-save')).click();
        }

        function addActionDial(action) {
            element(by.id('view-editDialplan-add-action')).click();
            element(by.model('action.name')).clear().sendKeys(action.name);
            element(by.tagName('md-select')).click();
            element.all(by.css('.md-select-menu-container.md-active md-option')).first().click();
            element(by.model('action.typeSpecific.ringingTime')).clear().sendKeys(action.ringingTime);
            element(by.css('input[type="search"]')).sendKeys(action.sipClients[0]);
            element(by.className('md-contact-name')).click();
            element(by.css('input[type="search"]')).sendKeys(action.sipClients[1]);
            element.all(by.className('md-contact-name')).last().click();
            element(by.id('plane-editAction-save')).click();
        }

        it('should add dialplan', function () {
            expect(element.all(by.className('view-dialplans-name')).count()).toEqual(0);
            element.all(by.className('view-dialplan-add-dialplan')).first().click();
            element(by.model('dialplan.name')).clear().sendKeys("Test-Dialplan-01");
            element(by.model('dialplan.phone')).clear().sendKeys("999");
            expect(element.all(by.repeater('action in dialplan.action')).count()).toEqual(0);
            addActionSayAlpha(actionSayAlpha);
            expect(element.all(by.repeater('action in dialplan.actions')).count()).toEqual(1);
            addActionDial(actionDial);
            expect(element.all(by.repeater('action in dialplan.actions')).count()).toEqual(2);
            element(by.id('button-save-dialplan')).click();
            element(by.id('button-close-dialplan')).click();
            expect(element.all(by.className('view-dialplans-name')).count()).toEqual(1);
        });

        it('should delete dialplan', function () {
            element.all(by.className('view-dialplan-add-dialplan')).first().click();
            element(by.model('dialplan.name')).clear().sendKeys("Test-Dialplan-01");
            element(by.model('dialplan.phone')).clear().sendKeys("999");
            addActionSayAlpha(actionSayAlpha);
            addActionDial(actionDial);
            expect(element.all(by.repeater('action in dialplan.actions')).count()).toEqual(2);
            element(by.id('button-save-dialplan')).click();
            element.all(by.className('view-editDialplan-edit')).first().click();
            element(by.id('plane-action-delete')).click();
            expect(element.all(by.repeater('action in dialplan.actions')).count()).toEqual(1);
        });

        it('should swap dialplans', function () {
            element.all(by.className('view-dialplan-add-dialplan')).first().click();
            element(by.model('dialplan.name')).clear().sendKeys("Test-Dialplan-01");
            element(by.model('dialplan.phone')).clear().sendKeys("999");
            addActionSayAlpha(actionSayAlpha);
            addActionDial(actionDial);
            expect(element.all(by.repeater('action in dialplan.actions')).count()).toEqual(2);
            expect(element.all(by.className('view-editDialplan-action-name')).first().getText()).toEqual("Voice Message: Test-Action-01");
            element.all(by.className('view-editDialplan-down')).first().click();
            expect(element.all(by.className('view-editDialplan-action-name')).last().getText()).toEqual("Voice Message: Test-Action-01");
            element.all(by.className('view-editDialplan-up')).last().click();
            expect(element.all(by.className('view-editDialplan-action-name')).first().getText()).toEqual("Voice Message: Test-Action-01");
        });

        it('should update dialplan', function () {
            element.all(by.className('view-dialplan-add-dialplan')).first().click();
            element(by.model('dialplan.name')).clear().sendKeys("Test-Dialplan-01");
            element(by.model('dialplan.phone')).clear().sendKeys("999");
            addActionSayAlpha(actionSayAlpha);
            addActionDial(actionDial);
            expect(element.all(by.repeater('action in dialplan.actions')).count()).toEqual(2);
            element(by.id('button-save-dialplan')).click();
            element.all(by.className('view-editDialplan-edit')).first().click();

            element(by.model('action.name')).clear().sendKeys("rename");
            element(by.id('plane-editAction-save')).click();
            expect(element.all(by.className('view-editDialplan-action-name')).first().getText()).toEqual("Voice Message: rename");
        });
    });
});
