//chat Controller
function chatCtrl(kwickService, $rootScope, $interval, $scope) {
    var chat = this;
    chat.usersConnectedList = {};
    chat.listMessages = {};
    /* Glue the view on the bottom of chatWindow*/
    chat.glued = true;

    //take all the messages from the chat feed 
    chat.getAllMessages = function () {
        kwickService
            .allMessages($rootScope.user.token)
            .then(function (dataAllMessages) {
                if (dataAllMessages && dataAllMessages.talk) {
                    if ($rootScope.dataWatched.messagesChatFeedCount == dataAllMessages.talk.length) {
                        return false;
                    } else {
                        chat.listMessages = dataAllMessages.talk;
                        $rootScope.dataWatched.messagesChatFeedCount = chat.listMessages.length;
                    }
                }
            }).catch(function (error) {
                console.error('error ==>', error);
            });
    }
    //Function get the names and count of users online   
    chat.getUsersOnline = function () {
        kwickService
            .usersOnline($rootScope.user.token)
            .then(function (dataUsersOnline) {
                if (dataUsersOnline && dataUsersOnline.user) {
                    if (($rootScope.dataWatched.usersOnlineCount == dataUsersOnline.user.length)) {
                        return false;
                    } else {
                        chat.usersConnectedList = dataUsersOnline.user;
                        $rootScope.dataWatched.usersOnlineCount = chat.usersConnectedList.length;
                        $rootScope.dataWatched.usersOnline = chat.usersConnectedList;
                        $rootScope.dataWatched.usersOnlineCount = chat.usersConnectedList.length;
                    }
                }
            })
            .catch(function (error) {
                console.error('error ==>', error);
            });
    }
    //Function post message
    chat.post = function () {
        kwickService
            .postMessage($rootScope.user.token, $rootScope.user.id, chat.postMessage)
            .then(function () {
                chat.postMessage = "";
            }).catch(function (error) {
                console.error('error ==>', error);
            });
    }
    //Function log out
    chat.logout = function () {
        kwickService
            .logout($rootScope.user.token, $rootScope.user.id)
            .then(function (userDisconnection) {
                $rootScope.isUserConnected = false;
                $rootScope.displayErrorMessage = null;
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
                var unregister = $scope.$watch('rootScope', function () {
                    // Do something interesting here ...
                    unregister();
                });
            }).catch(function (error) {
                console.error('error ==>', error);
            });
    }

    chat.updateChat = function () {
        chat.getUsersOnline();
        chat.getAllMessages();
    };


    $scope.$watch(function (rootScope) {
            return rootScope.dataWatched;
        },
        function (newValue, oldValue) {
            if (newValue = true) {
                $rootScope.interval = $interval(chat.updateChat, 1000);
            }
        });

    chat.updateChat();
}