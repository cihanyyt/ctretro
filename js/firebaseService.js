'use strict';

angular
  .module('fireideaz')
  .service('FirebaseService', ['$firebaseArray', function ($firebaseArray) {
    var firebaseUrl = 'https://ctretro.firebaseio.com';

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

    return {
      newFirebaseArray: newFirebaseArray,
      getServerTimestamp: getServerTimestamp,
      getMessagesRef: getMessagesRef,
      getMessageRef: getMessageRef,
      getBoardsRef: getBoardsRef,
      getBoardRef: getBoardRef,
      getBoardColumns: getBoardColumns
    };
  }]);
