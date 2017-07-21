(function() {
    'use strict';
    var app = angular.module('chatApp', ['luegg.directives']);
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
            name: null,
            messageSent: null,
        };
        $rootScope.dataWatched = {
            usersOnline: null,
            usersOnlineCount: null,
            messagesChatFeedCount: null,
            messagesChatFeed: null
        }
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
            allMessages: function(token, timestamp) {
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
    function userInfoCtrl(kwickService, $rootScope, $http, $interval) {
        $rootScope.isUserConnected = false;
        var user = this;
        user.formInfo = {};
        // Function signup
        user.signup = function() {
            kwickService
                .register(user.signupInfo.Name, user.signupInfo.Password)
                .then(function(userInfo) {
                    user.signupInfo.Name = "";
                    user.signupInfo.Password = "";
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
                    user.loginInfo.Name = "";
                    user.loginInfo.Password = "";
                    console.log("you're now connected");
                    console.log(userInfo);
                    $rootScope.user.id = userInfo.id;
                    $rootScope.user.token = userInfo.token;
                    $rootScope.user.name = user.loginInfo.Name;

                    $rootScope.isUserConnected = true;
                });
        }
    };
    //chat Controller
    function chatCtrl(kwickService, $rootScope, $interval, $scope) {
        var chat = this;
        chat.usersConnectedList = {};
        chat.listMessages = {};
        /* Glue the view on the bottom of chatWindow*/
        chat.glued = true;

        //take all the messages from the chat feed 
        chat.getAllMessages = function() {
            kwickService
                .allMessages($rootScope.user.token)
                .then(function(dataAllMessages) {
                    if ($rootScope.dataWatched.messagesChatFeedCount == dataAllMessages.talk.length) {
                        return false;
                    } else {
                        chat.listMessages = dataAllMessages.talk;
                        $rootScope.dataWatched.messagesChatFeedCount = chat.listMessages.length;
                        console.log(chat.listMessages);
                    }
                });
        }
        //Function get the names and count of users online   
        chat.getUsersOnline = function() {
            kwickService
                .usersOnline($rootScope.user.token)
                .then(function(dataUsersOnline) {
                    if ($rootScope.dataWatched.usersOnlineCount == dataUsersOnline.user.length) {
                        return false;
                    } else {
                        chat.usersConnectedList = dataUsersOnline.user;
                        $rootScope.dataWatched.usersOnlineCount = chat.usersConnectedList.length;
                        $rootScope.dataWatched.usersOnline = chat.usersConnectedList;
                        $rootScope.dataWatched.usersOnlineCount = chat.usersConnectedList.length;
                        console.log(chat.usersConnectedList.length);
                    }

                });
        }
        //Function post message
        chat.post = function() {
            kwickService
                .postMessage($rootScope.user.token, $rootScope.user.id, chat.postMessage)
                .then(function() {
                    console.log("you've post a message");
                    chat.postMessage = "";
                });
        }
        //Function log out
        chat.logout = function() {
            kwickService
                .postMessage($rootScope.user.token, $rootScope.user.id)
                .then(function(userDisconnection) {
                    $rootScope.isUserConnected = false;
                    console.log("you've been disconnected");
                });

        }

        chat.updateChat = function() {
            chat.getUsersOnline();
            chat.getAllMessages();
        };


        $scope.$watch(function(rootScope) {
                return rootScope.dataWatched;
            },
            function(newValue, oldValue) {
                if (newValue = true) {
                    $rootScope.interval = $interval(chat.updateChat, 1000);
                }
            });

        chat.updateChat();
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