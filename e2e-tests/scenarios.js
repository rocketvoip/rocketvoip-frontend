'use strict';
describe('rocketvoip', function () {

    it('should automatically redirect to /dashboard when location hash/fragment is empty', function () {
        browser.get('index.html');
        expect(browser.getCurrentUrl()).toMatch("/dashboard");
    });

    it('should automatically redirect to /dashboard when location does not exist', function () {
        browser.get('index.html#!/fdgdfgdfghngdfg');
        expect(browser.getCurrentUrl()).toMatch("/dashboard");
    });
});
