'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

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

    describe('view2', function () {

        beforeEach(function () {
            browser.get('index.html#!/view2');
        });

        it('should render view2 when user navigates to /view2', function () {
            expect(element.all(by.css('[ng-view] p')).first().getText()).toMatch(/partial for view 2/);
        });

    });

    describe('view_users', function () {

        function addUser(){
            expect(element.all(by.repeater('sipUser in sipUsers')).count()).toEqual(0);
            element(by.className('button-add-user')).click();
            element(by.model('user.name')).sendKeys('Marco Studerus');
            element(by.model('user.phone')).sendKeys('+410000000');
            element(by.className('plane-editUser-save')).click();
            expect(element.all(by.repeater('sipUser in sipUsers')).count()).toEqual(1);
        }

        beforeEach(function () {
            browser.get('index.html#!/view_users');
        });

        it('should open plane view for new user', function () {
            var plane = element.all(by.className('md-panel user-dialog'));
            expect(plane.count()).toEqual(0);
            element(by.className('button-add-user')).click();
            plane = element.all(by.className('md-panel user-dialog'));
            expect(plane.count()).toEqual(1);
            expect(element(by.className('plane-editUser-title')).getText()).toEqual('Add a new User');
        });

        it('should save new user', function () {
            addUser();
        });

        it('should not save new user when close plane', function () {
            expect(element.all(by.repeater('sipUser in sipUsers')).count()).toEqual(0);
            element(by.className('button-add-user')).click();
            var plane = element.all(by.className('md-panel user-dialog'));
            expect(plane.count()).toEqual(1);
            element(by.className('plane-editUser-close')).click();
            plane = element.all(by.className('md-panel user-dialog'));
            expect(plane.count()).toEqual(0);
            expect(element.all(by.repeater('sipUser in sipUsers')).count()).toEqual(0);
        });

        it('should save user when click save plane (edit User)', function () {
            addUser();
            var newPhone = '+411111111';
            expect(element.all(by.repeater('sipUser in sipUsers')).count()).toEqual(1);
            expect(element(by.className('view-user-sipUserPhone')).getText()).toEqual('+410000000');
            element(by.className('view-user-edituser')).click();
            element(by.model('user.phone')).clear().sendKeys(newPhone);
            element(by.className('plane-editUser-save')).click();
            expect(element.all(by.repeater('sipUser in sipUsers')).count()).toEqual(1);
            expect(element(by.className('view-user-sipUserPhone')).getText()).toEqual(newPhone);
        });

        it('should not save user when click close plane (edit User)', function () {
            addUser();
            var newPhone = '+411111111';
            expect(element.all(by.repeater('sipUser in sipUsers')).count()).toEqual(1);
            expect(element(by.className('view-user-sipUserPhone')).getText()).toEqual('+410000000');
            element(by.className('view-user-edituser')).click();
            element(by.model('user.phone')).clear().sendKeys(newPhone);
            element(by.className('plane-editUser-close')).click();
            expect(element.all(by.repeater('sipUser in sipUsers')).count()).toEqual(1);
            expect(element(by.className('view-user-sipUserPhone')).getText()).toEqual('+410000000');
        });


    });

});
