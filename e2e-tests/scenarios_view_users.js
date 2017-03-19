'use strict';

describe('rocket voip', function () {

    describe('view_users', function () {

        function addSipUser(sipUser) {
            if (sipUser == undefined) {
                var sipUser = {
                    name: 'Marco Studerus',
                    phone: '+410000000'
                }
            }

            element(by.className('button-add-user')).click();
            element(by.model('user.name')).sendKeys(sipUser.name);
            element(by.model('user.phone')).sendKeys(sipUser.phone);
            element(by.className('plane-editUser-save')).click();
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
            expect(element.all(by.repeater('sipUser in sipUsers')).count()).toEqual(0);
            addSipUser();
            expect(element.all(by.repeater('sipUser in sipUsers')).count()).toEqual(1);

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
            addSipUser();
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
            addSipUser();
            var newPhone = '+411111111';
            expect(element.all(by.repeater('sipUser in sipUsers')).count()).toEqual(1);
            expect(element(by.className('view-user-sipUserPhone')).getText()).toEqual('+410000000');
            element(by.className('view-user-edituser')).click();
            element(by.model('user.phone')).clear().sendKeys(newPhone);
            element(by.className('plane-editUser-close')).click();
            expect(element.all(by.repeater('sipUser in sipUsers')).count()).toEqual(1);
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
            expect(invalid.count()).toEqual(2);
            plane = element.all(by.className('md-panel user-dialog'));
            expect(plane.count()).toEqual(1);
        });

        it('should not save and close when input is not complete', function () {
            element(by.className('button-add-user')).click();
            var plane = element.all(by.className('md-panel user-dialog'));
            expect(plane.count()).toEqual(1);
            element(by.model('user.phone')).sendKeys("+413333333");
            var invalid = element.all(by.className('ng-invalid ng-invalid-required ng-touched'));
            expect(invalid.count()).toEqual(0);
            element(by.className('plane-editUser-save')).click();
            invalid = element.all(by.className('ng-invalid ng-invalid-required ng-touched'));
            expect(invalid.count()).toEqual(1);
            plane = element.all(by.className('md-panel user-dialog'));
            expect(plane.count()).toEqual(1);
        });

        it('should sort table by name by default', function () {
            var sipUser1 = {
                name: "Z",
                phone: "+41711234567"
            };
            var sipUser2 = {
                name: "M",
                phone: "+41711234568"
            };
            var sipUser3 = {
                name: "A",
                phone: "+41711234568"
            };
            addSipUser(sipUser1);
            addSipUser(sipUser2);
            addSipUser(sipUser3);
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipUser3.name);
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipUser1.name);
        });

        it('should change sort table by name on change', function () {
            var sipUser1 = {
                name: "Z",
                phone: "+41711234567"
            };
            var sipUser2 = {
                name: "M",
                phone: "+43711234568"
            };
            var sipUser3 = {
                name: "A",
                phone: "+41711234568"
            };
            addSipUser(sipUser1);
            addSipUser(sipUser2);
            addSipUser(sipUser3);
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipUser3.name);
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipUser1.name);

            element(by.id('view-user-sort-name')).click();
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipUser3.name);
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipUser1.name);
            element(by.id('view-user-sort-name')).click();
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipUser3.name);
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipUser1.name);
        });

        it('should change sort table by phone on change', function () {
            var sipUser1 = {
                name: "Z",
                phone: "+41711234567"
            };
            var sipUser2 = {
                name: "M",
                phone: "+43711234568"
            };
            var sipUser3 = {
                name: "A",
                phone: "+41711234568"
            };
            addSipUser(sipUser1);
            addSipUser(sipUser2);
            addSipUser(sipUser3);
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipUser3.name);
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipUser1.name);

            element(by.id('view-user-sort-phone')).click();
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipUser2.name);
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipUser1.name);

            element(by.id('view-user-sort-phone')).click();
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipUser1.name);
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipUser2.name);

        });

        it('should filter table ', function () {
            var sipUser1 = {
                name: "Z-000000",
                phone: "+41711234568"
            };
            var sipUser2 = {
                name: "M",
                phone: "+41710000000"
            };
            var sipUser3 = {
                name: "A",
                phone: "+41711234568"
            };
            addSipUser(sipUser1);
            addSipUser(sipUser2);
            addSipUser(sipUser3);
            expect(element.all(by.className('view-user-sipUserName')).count()).toEqual(3);
            element(by.id('view-user-filter-input')).sendKeys('00000');
            expect(element.all(by.className('view-user-sipUserName')).count()).toEqual(2);
            expect(element.all(by.className('view-user-sipUserName')).first().getText()).toEqual(sipUser2.name);
            expect(element.all(by.className('view-user-sipUserName')).last().getText()).toEqual(sipUser1.name);
            element(by.id('view-user-filter-input')).clear();
            expect(element.all(by.className('view-user-sipUserName')).count()).toEqual(3);
        });
    });
});
