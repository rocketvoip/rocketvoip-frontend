'use strict';

describe('rocketvoip', function () {

    describe('view_users', function () {

        beforeEach(function () {
            browser.get('index.html');

            var mockFunction = function () {
                angular.module('httpBackendMock', ['ngMockE2E'])
                    .run(function ($httpBackend) {
                        $httpBackend.whenGET(/\/admins/).respond(function () {
                            return [200, [], {}];
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

    });
});
