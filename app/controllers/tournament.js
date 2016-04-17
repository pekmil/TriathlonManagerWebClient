'use strict';

tmwcapp.controller('TournamentCtrl', ['$scope', '$rootScope', 'tournamentService', '$uibModal',
  function($scope, $rootScope, tournamentService, $uibModal) {

    getTournaments();

	function getTournaments(){
        tournamentService.getTournaments().then(
            function(tournaments){
                $scope.tournaments = tournaments;
            },
            function(error){
                alert(error);
            }
        );
    }

    function updateTournament(){
        tournamentService.updateTournament($scope.selected).then(
            function(response){
                getTournaments();
            },
            function(error){
                alert(error);
            }
        );
    }

    function createTournament(){
        tournamentService.createTournament($scope.selected).then(
            function(response){
                getTournaments();
            },
            function(error){
                alert(error);
            }
        );
    }

    function deleteTournament(){
        tournamentService.deleteTournament($scope.selected).then(
            function(response){
                getTournaments();
            },
            function(error){
                alert(error);
            }
        );
    }

    var open = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'views/dialog/tournamentDialog.html',
            controller: 'TournamentCtrl',
            scope: $scope
        });
        return modalInstance.result;
    }

    $scope.create = function(){
        $scope.editMode = true;
        $scope.selected = {};
        $scope.dialogTitle = "Körverseny hozzáadása";
        $scope.dialogBtnLabel = "Hozzáad";
        open().then(
            function(){ createTournament(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.edit = function(tournament){
        $scope.editMode = true;
        $scope.dialogTitle = "Körverseny módosítása";
        $scope.dialogBtnLabel = "Mentés";
        $scope.selected = angular.copy(tournament);
        open().then(
            function(){ updateTournament(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.delete = function(tournament){
        $scope.editMode = false;
        $scope.dialogTitle = "Körverseny törlése";
        $scope.dialogBtnLabel = "Törlés";
        $scope.selected = angular.copy(tournament);
        open().then(
            function(){ deleteTournament(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    function alert(error){
        $rootScope.$broadcast('notificationEvent', { type: 'danger', msg: error });
    }

  }]);