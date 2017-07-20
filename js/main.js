(function() {
    'use strict';
    var app = angular.module('chatApp', []);
    // Whitlist API
    app.config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://greenvelvet.alwaysdata.net/kwick/api/**'
        ]);
    });

    app.run(function($rootScope) {
        $rootScope.isUserConnected = false;
        $rootScope.user = {
            id: null,
            token: null,
            name: null
        };
    });

    // API SERVICE
    app.service('kwickService', function($http) {
        return {
            status: function() {
                return $http
                    .jsonp('http://greenvelvet.alwaysdata.net/kwick/api/ping')
                    .then(function(response) {
                        return response.data.result;
                    })
            },
            connect: function(username, password) {
                return $http
                    .jsonp('http://greenvelvet.alwaysdata.net/kwick/api/login/' + username + '/' + password)
                    .then(function(response) {
                        return response.data.result;
                    })
            },
            register: function(username, password) {
                return $http
                    .jsonp('http://greenvelvet.alwaysdata.net/kwick/api/signup/' + username + '/' + password)
                    .then(function(response) {
                        return response.data.result;
                    })
            },
            disconnect: function(token, user_id) {
                return $http
                    .jsonp('http://greenvelvet.alwaysdata.net/kwick/api/logout/' + token + '/' + user_id)
                    .then(function(response) {
                        return response.data.result;
                    })
            },
            usersOnline: function(token) {
                return $http
                    .jsonp('http://greenvelvet.alwaysdata.net/kwick/api/user/logged/' + token)
                    .then(function(response) {
                        return response.data.result;
                    })
            },
            postMessage: function(token, user_id, message) {
                return $http
                    .jsonp('http://greenvelvet.alwaysdata.net/kwick/api/say/' + token + '/' + user_id + '/' + message)
                    .then(function(response) {
                        return response.data.result;
                    })
            },
            getAllMessages: function(token, timestamp) {
                timestamp = timestamp || 0;
                return $http
                    .jsonp('http://greenvelvet.alwaysdata.net/kwick/api/talk/list/' + token + '/' + timestamp)
                    .then(function(response) {
                        return response.data.result;
                    })
            },
        }
    });
    //User Controller
    function userInfoCtrl(kwickService, $rootScope, $http) {
        let user = this;
        user.formInfo = {};
        // Function signup
        user.signup = function() {
                kwickService
                    .register(user.signupInfo.Name, user.signupInfo.Password)
                    .then(function(userInfo) {
                        console.log("you're now registered");
                        $rootScope.user.id = userInfo.id;
                        $rootScope.user.token = userInfo.token;
                        $rootScope.user.name = user.signupInfo.Name;

                        $rootScope.isUserConnected = true;
                    });
            }
        // Function login
        user.login = function() {
            kwickService
                .connect(user.loginInfo.Name, user.loginInfo.Password)
                .then(function(userInfo) {
                    console.log("you're now connected");
                    console.log(userInfo);
                    $rootScope.user.id = userInfo.id;
                    $rootScope.user.token = userInfo.token;
                    $rootScope.user.name = user.loginInfo.Name;

                    $rootScope.isUserConnected = true;
                });
        }
    };

    function chatCtrl(kwickService, $rootScope) {
        let chat = this;
        if ($rootScope.isUserConnected) {
            chat.listMessages = {};
            kwickService
                .getAllMessages($rootScope.user.token)
                .then(function(data) {
                    chat.listMessages = data.talk;
                    console.log("ta mere");
                });
        }
    }

    //DIRECTIVES
    app.directive("connectionForms", function() {
        return {
            templateUrl: "./templates/forms-template.html",
            restrict: "E",
            controller: userInfoCtrl,
            controllerAs: 'user'
        };
    });

    app.directive("chatFeed", function() {
        return {
            templateUrl: "./templates/chat-feed-template.html",
            restrict: "E",
            controller: chatCtrl,
            controllerAs: 'chat'
        };
    });

})();