'use strict';

describe('rocketvoip', function () {

    describe('view_admins', function () {

        beforeEach(function () {
            browser.get('index.html');

            var mockFunction = function () {
                angular.module('httpBackendMock', ['ngMockE2E'])
                    .run(function ($httpBackend) {
                        var admins = [];
                        var nextId = 0;
                        $httpBackend.whenGET(/\/companies/).respond(function () {
                            return [200, [{"name": "test01", "id": 2}], {}];
                        });
                        $httpBackend.whenGET(/\/dialplans/).respond(function () {
                            return [200, [], {}];
                        });
                        $httpBackend.whenGET(/\/sipclients/).respond(function () {
                            return [200, [], {}];
                        });
                        $httpBackend.whenGET(/\/admins/).respond(function () {
                            return [200, admins, {}];
                        });
                        $httpBackend.whenPOST(/\/admins/).respond(function (method, url, data) {
                            var admin = angular.fromJson(data);
                            admin.id = nextId;
                            nextId++;
                            admins.push(admin);
                            return [200, admin, {}];
                        });
                        $httpBackend.whenPUT(/\/admins\//).respond(function (method, url, data) {
                            var admin = angular.fromJson(data);
                            angular.forEach(admins, function (adminInArray, key) {
                                if (adminInArray.id == admin.id) {
                                    admins[key] = admin;
                                }
                            });
                            return [200, admin, {}];
                        });
                        $httpBackend.whenDELETE(/\/admins/).respond(function (method, url) {
                            var split = url.split("/");
                            var id = split[split.length - 1].split("?")[0];
                            for (var i = admins.length - 1; i >= 0; i--) {
                                if (admins[i].id == id) {
                                    admins.splice(i, 1);
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
            browser.get('index.html#!/view_admins');
        });

        it('should show menu button', function () {
            expect(element(by.css('a[ng-href="#!/view_admins"]')).isPresent()).toBeTruthy();
        });

        it('should diaplay site', function () {
            expect(element(by.id('view-admins')).isPresent()).toBeTruthy();
        });

        var testAdmin1 = {
            "firstName": "Hugo",
            "lastName": "Boss",
            "userName": "test@test.net",
            "password": "12345678"
        };

        function addAdmin(admin) {
            element(by.id('view-admin-add-admin')).click();
            element(by.model('admin.userName')).sendKeys(admin.userName);
            element(by.model('admin.firstName')).sendKeys(admin.firstName);
            element(by.model('admin.password')).sendKeys(admin.password);
            element(by.model('admin.lastName')).sendKeys(admin.lastName);
            element(by.model('confirmPassword')).sendKeys(admin.password);
            element(by.css('input[type="search"]')).sendKeys("test");
            element(by.className('md-contact-name')).click();
            element.all(by.className('plane-editAdmin-save')).first().click();
        }

        it('should add new admin', function () {
            expect(element.all(by.tagName('md-list-item')).count()).toBe(0);
            addAdmin(testAdmin1);
            expect(element.all(by.tagName('md-list-item')).count()).toBe(1);
        });

        it('should delete admin', function () {
            addAdmin(testAdmin1);
            expect(element.all(by.tagName('md-list-item')).count()).toBe(1);
            element.all(by.className('view-admins-editAdmin')).first().click();
            element(by.id('plane-editAdmin-delete')).click();
            expect(element.all(by.tagName('md-list-item')).count()).toBe(0);
        });

        it('should reset admin password', function () {
            addAdmin(testAdmin1);
            var elm = element(by.id('dialog-resetPassword'));
            expect(browser.isElementPresent(elm)).toBe(false);
            element.all(by.className('view-admins-resetPassword')).first().click();
            elm = element(by.id('dialog-resetPassword'));
            expect(browser.isElementPresent(elm)).toBe(true);
            element(by.model('admin.password')).sendKeys("123456789");
            element(by.model('confirmPassword')).sendKeys("123456789");
            element.all(by.className('dialog-resetPassword-save')).first().click();
            var elm = element(by.id('dialog-resetPassword'));
            expect(browser.isElementPresent(elm)).toBe(false);
        });
    });
});
