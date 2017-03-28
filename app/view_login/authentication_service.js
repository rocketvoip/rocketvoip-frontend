/*
 Service for Auth.
 Author: Marco Studerus
 Template: Jason Watmore (http://jasonwatmore.com/post/2016/04/05/angularjs-jwt-authentication-example-tutorial)
 */
'use strict';
angular.module('rocketvoip.login', [])
    .factory('AuthenticationService', function Service($http, $localStorage,appConfig) {
        var url = appConfig.BACKEND_BASE_URL + appConfig.API_ENDPOINT + '/login';
        return {
            Login: function (username, password, callback) {
                $http.post(url, {
                    username: username,
                    password: password
                }).then(function successCallback(response) {
                    if (response.token) {
                        $localStorage.currentUser = {username: username, token: response.token};
                        $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;
                        callback(true);
                    } else {
                        callback('Email Address or password is incorrect');
                    }
                }, function errorCallback(response) {
                    callback('Could not reach the Server...');
                });
            },
            Logout: function () {
                delete $localStorage.currentUser;
                $http.defaults.headers.common.Authorization = '';
            }
        };
    });