'use strict';

angular
  .module('fireideaz')
  .controller('MainCtrl', ['$scope', '$filter',
    '$window', 'Utils', 'Auth', '$rootScope', 'FirebaseService', 'ModalService',
    function($scope, $filter, $window, utils, auth, $rootScope, firebaseService, modalService) {
      $scope.loading = true;
      $scope.messageTypes = utils.messageTypes;
      $scope.utils = utils;
      $scope.auth = auth;
      $scope.newBoard = {
        name: '',
        votecount: ''
      };
      $scope.boardId = $window.location.hash.substring(1) || '';
      $scope.sortField = '$id';
      $scope.selectedType = 1;
      $scope.closeAllModals = function(){
        modalService.closeAll();
      };

      if(auth.getCurrentUser()){
        $scope.currentUser = auth.getCurrentUser();
        listboards();
      }



      $scope.login = function() {
        auth.createUserAndLog($scope.Email, $scope.Password, loginresult);
      };

      $scope.getCurrentUser = function () {
        return auth.getCurrentUser();
      }
      
      function loginresult(authData) {
        $scope.currentUser = auth.getCurrentUser();
        if(!authData){
          $scope.error = 'Login failed please check your credentials';
        }
        else {
          $scope.error = null;
        }
        listboards();
        $scope.$apply()
      }

      function listboards(){
        var boards = firebaseService.newFirebaseArray(firebaseService.getBoardsRef().orderByChild("date_created"));
        boards.$loaded(function () {
          $scope.boards = boards;
        });
      }

      $scope.redirectToMain = function(){
        window.location.href = window.location.origin;
        $scope.boardId = '';
      }

      function getBoardAndMessages() {
        if(!auth.getCurrentUser()){
          $scope.redirectToMain();
        }
        $scope.boardId = $window.location.hash.substring(1) || '499sm';
        var messagesRef = firebaseService.getMessagesRef($scope.boardId);
        var board = firebaseService.getBoardRef($scope.boardId);

        board.on('value', function(board) {
          $scope.board = board.val();
          $scope.boardName = $rootScope.boardName = board.val().boardName;
          $scope.boardContext = $rootScope.boardContext = board.val().boardContext;
          $scope.votecount = board.val().votecount;
          var votesremain = localStorage.getItem($scope.boardId);
          if(!votesremain)
            localStorage.setItem($scope.boardId, Number($scope.votecount));
        });

        $scope.boardRef = board;
        $scope.userUid = auth.getCurrentUser().uid;
        $scope.messages = firebaseService.newFirebaseArray(messagesRef);
        $scope.loading = false;
        firebaseService.setPresence($scope.userUid, $scope.boardId.substring(1));
        var userlist = firebaseService.getOnlineUsers($scope.boardId.substring(1));
        userlist.$loaded(function () {
            $scope.userlist = userlist;
        });
      }

      $scope.saveVoteCount = function () {
        var board = firebaseService.getBoardRef($scope.boardId);
        board.on('value', function(data) {
          var votecount = Number(data.val().votecount);
          if(votecount == $scope.votecount)
            return;
          var voteremain = Number(localStorage.getItem($scope.boardId));
          localStorage.setItem($scope.boardId, Number(voteremain + ($scope.votecount - votecount)));
          board.update({
            votecount: $scope.votecount
          });
        });
      }

      if ($scope.boardId !== '') {
        var messagesRef = firebaseService.getMessagesRef($scope.boardId);
        getBoardAndMessages();
      } else {
        $scope.loading = false;
      }

      $scope.isColumnSelected = function(type) {
        return parseInt($scope.selectedType) === parseInt(type);
      };

      $scope.seeNotification = function() {
        localStorage.setItem('ctretro1', true);
      };

      $scope.showNotification = function() {
        return !localStorage.getItem('ctretro1') && $scope.boardId !== '';
      };

      $scope.getSortOrder = function() {
        return $scope.sortField === 'votes' ? true : false;
      };

      $scope.toggleVote = function (key, votes) {
        var votesremain = Number(localStorage.getItem($scope.boardId));
        if (!localStorage.getItem(key)) {
          var messagesRef = firebaseService.getMessagesRef($scope.boardId);
          console.log(votesremain);
          if (--votesremain < 0) {
            alert('You have used all your votes.');
            return;
          }
          localStorage.setItem($scope.boardId, Number(votesremain));
          messagesRef.child(key).update({
            votes: votes + 1,
            date: firebaseService.getServerTimestamp()
          });

          localStorage.setItem(key, 1);
        } else {
          votesremain++;
          if (votesremain > $scope.votecount) {
            votesremain = $scope.votecount;
          }
          console.log(votesremain);
          localStorage.setItem($scope.boardId, Number(votesremain));
          var messagesRef = firebaseService.getMessagesRef($scope.boardId);
          messagesRef.child(key).update({
            votes: votes - 1,
            date: firebaseService.getServerTimestamp()
          });

          localStorage.removeItem(key);
        }
      };

      function redirectToBoard() {
        window.location.href = window.location.origin +
          window.location.pathname + '#' + $scope.boardId;
      }

      $scope.redirectToBoard = function(boardId) {
        window.location.href = window.location.origin +
          window.location.pathname + '#' + boardId;
      }

      $scope.createNewBoard = function() {
        $scope.loading = true;
        modalService.closeAll();
        $scope.boardId = utils.createBoardId();
        var board = firebaseService.getBoardRef($scope.boardId);
        if(isNaN($scope.newBoard.votecount)){
          $scope.newBoard.votecount = 3;
        }
        board.set({
          boardName: $scope.newBoard.name,
          votecount: $scope.newBoard.votecount,
          date_created: new Date().getTime(),
          columns: $scope.messageTypes,
          user_id: auth.getCurrentUser().uid
        });

        redirectToBoard();
        $scope.newBoard.name = '';
        $scope.newBoard.votecount = '';
      };

      $scope.changeBoardContext = function() {
        $scope.boardRef.update({
          boardContext: $scope.boardContext
        });
      };

      $scope.addNewColumn = function(name) {
        $scope.board.columns.push({
          value: name,
          id: utils.getNextId($scope.board)
        });

        var boardColumns = firebaseService.getBoardColumns($scope.boardId);
        boardColumns.set(utils.toObject($scope.board.columns));

        modalService.closeAll();
      };

      $scope.changeColumnName = function(id, newName) {
        $scope.board.columns[id - 1] = {
          value: newName,
          id: id
        };

        var boardColumns = firebaseService.getBoardColumns($scope.boardId);
        boardColumns.set(utils.toObject($scope.board.columns));

        modalService.closeAll();
      };

      $scope.deleteColumn = function(column) {
        $scope.board.columns = $scope.board.columns.filter(function(_column) {
            return _column.id !== column.id;
        });

        var boardColumns = firebaseService.getBoardColumns($scope.boardId);
        boardColumns.set(utils.toObject($scope.board.columns));
        modalService.closeAll();
      };

      $scope.deleteMessage = function(message) {
        $scope.messages.$remove(message);
        modalService.closeAll();
      };

      function addMessageCallback(message) {
        var id = message.key();
        angular.element($('#' + id)).scope().isEditing = true;
        $('#' + id).find('textarea').focus();
      }

      $scope.addNewMessage = function(type) {
        $scope.messages.$add({
          text: '',
          user_name: auth.getCurrentUser().password.email.split('@')[0],
          type: {
            id: type.id
          },
          date: firebaseService.getServerTimestamp(),
          votes: 0
        }).then(addMessageCallback);
      };

      $scope.keydown = function(value){
        if ((value.keyCode == 10 || value.keyCode == 13) && value.ctrlKey)
        {
          document.getElementById("btndone").click();
        }
      };

      $scope.deleteCards = function() {
        $($scope.messages).each(function(index, message) {
          $scope.messages.$remove(message);
        });

        modalService.closeAll();
      };

      $scope.logOut = function() {
        auth.logout();
        modalService.closeAll();
        $scope.redirectToMain();
      };

      $scope.getBoardText = function() {
        if ($scope.board) {
          var clipboard = '';

          $($scope.board.columns).each(function(index, column) {
            if (index === 0) {
              clipboard += '<strong>' + column.value + '</strong><br />';
            } else {
              clipboard += '<br /><strong>' + column.value + '</strong><br />';
            }
            var filteredArray = $filter('orderBy')($scope.messages,
              $scope.sortField,
              $scope.getSortOrder());

            $(filteredArray).each(function(index2, message) {
              if (message.type.id === column.id) {
                clipboard += '- ' + message.text + ' (' + message.votes + ' votes) <br />';
              }
            });
          });

          return clipboard;
        } else return '';
      };

      angular.element($window).bind('hashchange', function() {
        $scope.loading = true;
        $scope.boardId = $window.location.hash.substring(1) || '';
        getBoardAndMessages();
      });
    }
  ]);
