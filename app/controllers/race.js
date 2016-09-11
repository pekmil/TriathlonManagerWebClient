'use strict';

tmwcapp.controller('RaceCtrl', ['$scope', '$rootScope', '$routeParams', 'raceService', 'tournamentService', 'parameterService', 'resultmodService', 'notificationService', '$uibModal',
  function($scope, $rootScope, $routeParams, raceService, tournamentService, parameterService, resultmodService, notificationService, $uibModal) {

    var tid = $routeParams.tournamentId;
    if(tid === undefined){
        getRaces();
    }
    else{
        getTournamentRaces(tid)
    }

    $scope.getTournaments = function(refresh){
        if(!$scope.tournaments || refresh){
            $scope.tournaments = tournamentService.getTournaments().then(
                function(tournaments){
                    $scope.tournaments = tournaments;
                }
            );
        }
    }
    $scope.getTournaments(false);

	function getRaces(){
        raceService.getRaces().then(
            function(races){
                $scope.races = races;                
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function getTournamentRaces(tournamentId){
        raceService.getTournamentRaces(tournamentId).then(
            function(races){
                $scope.races = races;
                if(races){
                    $scope.selectedTournament = races[0].tournament;
                }
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function updateRace(){
        raceService.updateRace($scope.selected).then(
            function(response){
                getRaces();
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function createRace(){
        raceService.createRace($scope.selected).then(
            function(response){
                getRaces();
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function deleteRace(){
        raceService.deleteRace($scope.selected).then(
            function(response){
                getRaces();
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    var open = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'views/dialog/raceDialog.html',
            controller: 'RaceCtrl',
            scope: $scope
        });
        return modalInstance.result;
    }

    var openRaceadjustment = function(){        
        var modalInstance = $uibModal.open({
            templateUrl: 'views/dialog/raceadjustmentDialog.html',
            controller: 'RaceCtrl',
            scope: $scope
        });
        return modalInstance.result;
    }

    $scope.create = function(){
        $scope.editMode = true;
        $scope.selected = {};
        $scope.dialogTitle = "Verseny hozzáadása";
        $scope.dialogBtnLabel = "Hozzáad";
        open().then(
            function(){ createRace(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.edit = function(race){
        $scope.editMode = true;
        $scope.dialogTitle = "Verseny módosítása";
        $scope.dialogBtnLabel = "Mentés";
        $scope.selected = angular.copy(race);
        $scope.selected.startdate = new Date(race.startdate);
        $scope.selected.enddate = new Date(race.enddate);
        open().then(
            function(){ updateRace(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.delete = function(race){
        $scope.editMode = false;
        $scope.dialogTitle = "Verseny törlése";
        $scope.dialogBtnLabel = "Törlés";
        $scope.selected = angular.copy(race);
        $scope.selected.startdate = new Date(race.startdate);
        $scope.selected.enddate = new Date(race.enddate);
        open().then(
            function(){ deleteRace(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.selectRace = function(race){
        $rootScope.selectedRace = race;
    }

    $scope.addRaceadjustmentDialog = function(raceId){
        parameterService.getParameters('category').then(function(categories){$scope.categories = categories});
        resultmodService.getResultmods().then(function(resultmods){$scope.resultmods = resultmods});
        $scope.raceadjustment = {key : {raceId : raceId}};
        $scope.dialogTitle = "Időkorrekció hozzáadása";
        $scope.dialogBtnLabel = "Hozzáad";
        openRaceadjustment().then(
            function(){
                $scope.raceadjustment.key.categoryId = $scope.raceadjustment.category.id;
                $scope.raceadjustment.key.resultmodId = $scope.raceadjustment.resultmod.id;
                $scope.addRaceadjustment($scope.raceadjustment);
            }, 
            function(){$scope.raceadjustment = {};}
        );
    }

    $scope.addRaceadjustment = function(raceadjustment){
        raceService.createRaceadjustment(raceadjustment).then(
            function(response){
                getRaces();
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    $scope.removeRaceadjustment = function(key){
        raceService.deleteRaceadjustment(key).then(
            function(response){
                getRaces();
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

  }]);