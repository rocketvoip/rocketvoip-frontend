'use strict';
describe('rocket voip', function () {

    it('should automatically redirect to /dashboard when location hash/fragment is empty', function () {
        browser.get('index.html');
        expect(browser.getLocationAbsUrl()).toMatch("/dashboard");
    });

    describe('dashboard', function () {
        beforeEach(function () {
            browser.get('index.html#!/dashboard');
        });
        it('should render dashboard when user navigates to /dashboard', function () {
            expect(element.all(by.css('[ng-view] p')).first().getText()).toMatch(/version of the dashboard/);
        });
    });
});
