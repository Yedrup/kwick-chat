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