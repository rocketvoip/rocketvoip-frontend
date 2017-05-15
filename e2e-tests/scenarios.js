'use strict';
describe('rocketvoip', function () {

    it('should automatically redirect to /dashboard when location hash/fragment is empty', function () {
        browser.get('index.html');
        expect(browser.getLocationAbsUrl()).toMatch("/dashboard");
    });

    it('should automatically redirect to /dashboard when location does not exist', function () {
        browser.get('index.html#!/fdgdfgdfghngdfg');
        expect(browser.getLocationAbsUrl()).toMatch("/dashboard");
    });
});
