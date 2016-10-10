'use strict';

angular
  .module('fireideaz')
  .service('FirebaseService', ['$firebaseArray', '$firebaseObject', 'Auth', function ($firebaseArray, $firebaseObject, auth) {
    var firebaseUrl = 'https://ctretro.firebaseio.com';

    function newFirebaseObject(ref) {
        return $firebaseObject(ref);
    }

    function newFirebaseArray(messagesRef) {
      return $firebaseArray(messagesRef);
    }

    function getServerTimestamp() {
      return Firebase.ServerValue.TIMESTAMP;
    }

    function getMessagesRef(boardId) {
      return new Firebase(firebaseUrl + '/messages/' + boardId);
    }

    function getMessageRef(boardId, messageId) {
      return new Firebase(firebaseUrl + '/messages/' + boardId + '/' + messageId);
    }

    function getBoardsRef(){
      return new Firebase(firebaseUrl + '/boards');
    }

    function getBoardRef(boardId) {
      return new Firebase(firebaseUrl + '/boards/' + boardId);
    }

    function getBoardColumns(boardId) {
      return new Firebase(firebaseUrl + '/boards/' + boardId + '/columns');
    }

    function setPresence(userId, boardId) {
        if(boardId == '')
            return;
        var userRef = new Firebase(firebaseUrl + '/presence/' + boardId + '/' + userId);
        userRef.set(auth.getCurrentUser().password.email.split('@')[0]);

        var presenceRef = new Firebase(firebaseUrl + '/.info/connected');
        presenceRef.on("value", function(snap) {
            if (snap.val()) {
                userRef.onDisconnect().remove();
            }
        });
    }

    function resetPresence(userId) {
        setPresence(userId, '');
    }

    function getOnlineUsers(boardId){
      var boardPresenceRef = new Firebase(firebaseUrl + '/presence/' + boardId);
      return newFirebaseArray(boardPresenceRef);
    }


    return {
      newFirebaseObject: newFirebaseObject,
      newFirebaseArray: newFirebaseArray,
      getServerTimestamp: getServerTimestamp,
      getMessagesRef: getMessagesRef,
      getMessageRef: getMessageRef,
      getBoardsRef: getBoardsRef,
      getBoardRef: getBoardRef,
      getBoardColumns: getBoardColumns,
      setPresence: setPresence,
      resetPresence: resetPresence,
      getOnlineUsers: getOnlineUsers
    };
  }]);
