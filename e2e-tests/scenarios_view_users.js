'use strict';

describe('rocketvoip', function () {

    describe('view_users', function () {

        beforeEach(function () {
            browser.get('index.html');

            var mockFunction = function () {
                angular.module('httpBackendMock', ['ngMockE2E'])
                    .run(function ($httpBackend) {
                        var testSipClients = [];
                        var nextId = 0;
                        $httpBackend.whenGET(/\/sipclients/).respond(function () {
                            return [200, testSipClients, {}];
                        });
                        $httpBackend.whenPOST(/\/sipclients/).respond(function (method, url, data) {
                            var sipClient = angular.fromJson(data);
                            sipClient.id = ++nextId;
                            testSipClients.push(sipClient);
                            return [200, sipClient, {}];
                        });
                        $httpBackend.whenPUT(/\/sipclients\//).respond(function (method, url, data) {
                            var sipClient = angular.fromJson(data);
                            angular.forEach(testSipClients, function (client, key) {
                                if(client.id == sipClient.id) {
                                    testSipClients[key] = sipClient;
                                }
                            });
                            return [200, sipClient, {}];
                        });
                        $httpBackend.whenDELETE(/\/sipclients/).respond(function (method, url) {
                            var split = url.split("/")
                            var id = split[split.length-1].split("?")[0]
                            for (var i = testSipClients.length - 1; i >= 0; i--) {
                                if (testSipClients[i].id == id) {
                                    testSipClients.splice(i, 1);
                                }
                            }
                            return [200, {}, {}];
                        });
                        $httpBackend.whenPOST(/login/).respond(function () {
                            return [200, {},{'X-Auth-Token' : 'Test-Token'}];
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
            browser.get('index.html#!/view_users');
        });

        var sipClient1 = {
            name: "Z",
            phone: "+41711234567",
            secret: "12345678"
        };
        var sipClient2 = {
            name: "M",
            phone: "+41711234568",
            secret: "12345678"
        };
        var sipClient3 = {
            name: "A",
            phone: "+41711234568",
            secret: "12345678"
        };


        function addTestSipClient(sipClient) {
            if (sipClient == undefined) {
                sipClient = {
                    name: 'Marco Studerus',
                    phone: '+410000000',
                    secret: '12345678'
                }
            }

            element(by.className('button-add-user')).click();
            element(by.model('sipClient.name')).sendKeys(sipClient.name);
            element(by.model('sipClient.phone')).sendKeys(sipClient.phone);
            element(by.model('sipClient.secret')).sendKeys(sipClient.secret);
            element(by.className('plane-editUser-save')).click();
        }

        it('should refresh table after deleting a sip client', function () {
            addTestSipClient(sipClient1);
            addTestSipClient(sipClient2);
            addTestSipClient(sipClient3);
            expect(element.all(by.className('view-user-sipUserName')).count()).toEqual(3);
            element.all(by.className('view-user-edituser')).first().click();
            element(by.id('plane-editUser-deleteUser')).click();
            expect(element.all(by.className('view-user-sipUserName')).count()).toEqual(2);
        });

        it('should not show delete button (add sip client)', function () {
            element(by.className('button-add-user')).click();
            expect(element(By.id("plane-editUser-deleteUser")).isDisplayed()).toBeFalsy();
        });

        it('should open plane view for new sip client', function () {
            var plane = element.all(by.className('md-panel user-dialog'));
            expect(plane.count()).toEqual(0);
            element(by.className('button-add-user')).click();
            plane = element.all(by.className('md-panel user-dialog'));
            expect(plane.count()).toEqual(1);
            expect(element(by.className('plane-editUser-title')).getText()).toEqual('Add a new User');
        });

        it('should save new sip client', function () {
            expect(element.all(by.repeater('sipClient in sipClients')).count()).toEqual(0);
            addTestSipClient();
            expect(element.all(by.repeater('sipClient in sipClients')).count()).toEqual(1);

        });

        it('should not save new sip client when close plane', function () {
            expect(element.all(by.repeater('sipClient in sipClients')).count()).toEqual(0);
            element(by.className('button-add-user')).click();
            var plane = element.all(by.className('md-panel user-dialog'));
            expect(plane.count()).toEqual(1);
            element(by.className('plane-editUser-close')).click();
            plane = element.all(by.className('md-panel user-dialog'));
            expect(plane.count()).toEqual(0);
            expect(element.all(by.repeater('sipClient in sipClients')).count()).toEqual(0);
        });

        it('should save sip client when click save plane (edit User)', function () {
            addTestSipClient();
            var newPhone = '+411111111';
            expect(element.all(by.repeater('sipClient in sipClients')).count()).toEqual(1);
            expect(element(by.className('view-user-sipUserPhone')).getText()).toEqual('+410000000');
            element(by.className('view-user-edituser')).click();
            element(by.model('sipClient.phone')).clear().sendKeys(newPhone);
            element(by.className('plane-editUser-save')).click();
            expect(element.all(by.repeater('sipClient in sipClients')).count()).toEqual(1);
            expect(element(by.className('view-user-sipUserPhone')).getText()).toEqual(newPhone);
        });

        it('should not save sip client when click close plane (edit sip client)', function () {
            addTestSipClient();
            var newPhone = '+411111111';
            expect(element.all(by.repeater('sipClient in sipClients')).count()).toEqual(1);
            expect(element(by.className('view-user-sipUserPhone')).getText()).toEqual('+410000000');
            element(by.className('view-user-edituser')).click();
            element(by.model('sipClient.phone')).clear().sendKeys(newPhone);
            element(by.className('plane-editUser-close')).click();
            expect(element.all(by.repeater('sipClient in sipClients')).count()).toEqual(1);
            expect(element(by.className('view-user-sipUserPhone')).getText()).toEqual('+410000000');
        });

        it('should not save and close when input is empty', function () {
            element(by.className('button-add-user')).click();
            var plane = element.all(by.className('md-panel user-dialog'));
            expect(plane.count()).toEqual(1);
            var invalid = element.all(by.className('ng-invalid ng-invalid-required ng-touched'));
            expect(invalid.count()).toEqual(0);
            element(by.className('plane-editUser-save')).click();
            invalid = element.all(by.className('ng-invalid ng-invalid-required ng-touched'));
            expect(invalid.count()).toEqual(3);
            plane = element.all(by.className('md-panel user-dialog'));
            expect(plane.count()).toEqual(1);
        });

        it('should not save and close when input is not complete', function () {
            element(by.className('button-add-user')).click();
            var plane = element.all(by.className('md-panel user-dialog'));
            expect(plane.count()).toEqual(1);
            element(by.model('sipClient.phone')).sendKeys("+413333333");
            element(by.model('sipClient.secret')).sendKeys("dfasdffdadf");
            var invalid = element.all(by.className('ng-invalid ng-invalid-required ng-touched'));
            expect(invalid.count()).toEqual(0);
            element(by.className('plane-editUser-save')).click();
            invalid = element.all(by.className('ng-invalid ng-invalid-required ng-touched'));
            expect(invalid.count()).toEqual(1);
            plane = element.all(by.className('md-panel user-dialog'));
            expect(plane.count()).toEqual(1);
        });

        it('should sort table by name by default', function () {

            addTestSipClient(sipClient1);
            addTestSipClient(sipClient2);
            addTestSipClient(sipClient3);
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipClient3.name);
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipClient1.name);
        });

        it('should change sort table by name on change', function () {
            addTestSipClient(sipClient1);
            addTestSipClient(sipClient2);
            addTestSipClient(sipClient3);
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipClient3.name);
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipClient1.name);

            element(by.id('view-user-sort-name')).click();
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipClient3.name);
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipClient1.name);
            element(by.id('view-user-sort-name')).click();
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipClient3.name);
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipClient1.name);
        });

        it('should change sort table by phone on change', function () {
            sipClient1 = {
                name: "Z",
                phone: "+41711234567",
                secret: "12345678"
            };
            sipClient2 = {
                name: "M",
                phone: "+43711234568",
                secret: "12345678"
            };
            sipClient3 = {
                name: "A",
                phone: "+41711234568",
                secret: "12345678"
            };
            addTestSipClient(sipClient1);
            addTestSipClient(sipClient2);
            addTestSipClient(sipClient3);
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipClient3.name);
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipClient1.name);

            element(by.id('view-user-sort-phone')).click();
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipClient2.name);
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipClient1.name);

            element(by.id('view-user-sort-phone')).click();
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipClient1.name);
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipClient2.name);

        });

        it('should filter table ', function () {
            sipClient1 = {
                name: "Z-000000",
                phone: "+41711234568",
                secret: "12345678"
            };
            sipClient2 = {
                name: "M",
                phone: "+41710000000",
                secret: "12345678"
            };
            sipClient3 = {
                name: "A",
                phone: "+41711234568",
                secret: "12345678"
            };
            addTestSipClient(sipClient1);
            addTestSipClient(sipClient2);
            addTestSipClient(sipClient3);
            expect(element.all(by.className('view-user-sipUserName')).count()).toEqual(3);
            element(by.id('view-user-filter-input')).sendKeys('00000');
            expect(element.all(by.className('view-user-sipUserName')).count()).toEqual(2);
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipClient2.name);
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipClient1.name);
            element(by.id('view-user-filter-input')).clear();
            expect(element.all(by.className('view-user-sipUserName')).count()).toEqual(3);
        });

        it('should generate secret', function () {
            element(by.className('button-add-user')).click();
            element(by.id('plane-editUser-generatePW')).click();
            expect(element.all(by.model('sipClient.secret')).first().getText() != "").toBeTruthy();
        });

        it('should show secrets on switch enable', function () {
            addTestSipClient(sipClient1);
            expect(element.all(by.className('view-user-sipUserSecret')).first().isDisplayed()).toBeFalsy();
            element(by.id('view-user-show-secrets')).click();
            expect(element.all(by.className('view-user-sipUserSecret')).first().isDisplayed()).toBeTruthy();
        });

    });
});
