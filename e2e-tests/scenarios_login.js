'use strict';

describe('rocketvoip', function () {

    describe('view_companies', function () {

        beforeEach(function () {
            browser.get('index.html');
            var mockFunction = function () {
                angular.module('httpBackendMock', ['ngMockE2E'])
                    .run(function ($httpBackend) {
                        $httpBackend.whenPOST(/login/).respond(function () {
                            return [200, {}, {'X-Auth-Token': 'Test-Token'}];
                        });
                        $httpBackend.whenGET(/.*/).passThrough();
                    });
            };
            browser.addMockModule('httpBackendMock', mockFunction);
            element(by.id('logout')).isDisplayed().then(function (isVisible) {
                if (isVisible) {
                    element(by.id('logout')).click();
                }
            });
        });

        it('should not POST when user is not an email address', function () {
            var invalid = element.all(by.className('ng-invalid ng-invalid-required ng-touched'));
            expect(invalid.count()).toEqual(0);
            element(by.id('username')).clear().sendKeys("bad@bad,ch");
            element(by.id('password')).clear().sendKeys("password");
            element(by.id('viewLoginForm-login')).click();
            invalid = element.all(by.className('ng-invalid'));
            expect(invalid.count()).toEqual(2);
        });

        it('should display dashboard after login', function () {
            browser.get('index.html');
            element(by.id('username')).clear().sendKeys("good@good.ch");
            element(by.id('password')).clear().sendKeys("password");
            element(by.id('viewLoginForm-login')).click();
            expect(browser.getCurrentUrl()).toMatch("/dashboard");
        });

        it('should display dashboard after logout', function () {
            browser.get('index.html');
            element(by.id('username')).clear().sendKeys("good@good.ch");
            element(by.id('password')).clear().sendKeys("password");
            element(by.id('viewLoginForm-login')).click();
            expect(browser.getCurrentUrl()).toMatch("/dashboard");
            element(by.id('logout')).click();
            expect(browser.getCurrentUrl()).toMatch("/login");
        });

    });
});
