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
        $rootScope.isUserConnected = false;
        kwickService
            .postMessage($rootScope.user.token, $rootScope.user.id)
            .then(function(userDisconnection) {
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