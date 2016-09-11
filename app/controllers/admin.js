'use strict';

tmwcapp.controller('AdminCtrl', ['$scope', '$rootScope', 'adminService', 'raceService', 'entryService', 'AppConfig', '$uibModal', 'notificationService',
  function($scope, $rootScope, adminService, raceService, entryService, AppConfig, $uibModal, notificationService) {
    
    $scope.accordionOptions = {
        oneAtATime : true,
        modifyEntries : {
            open : true
        },
        deleteRaceData : {
            open : false
        }
        ,
        manageLicenceData : {
            open : false
        },
        modifyResult : {
            open : false
        },
        manageResultmods : {
            open : false
        }
    };
    $scope.data = {};
    $scope.csvUploadOptions = {
        csvUploadURL : AppConfig.serviceBaseURL + 'licence/uploadcsv',        
        expectedCSVHeader : 'l_id;l_name;l_licencenum;l_birthplace;l_birthyear',
        expectedDataLinePattern : /\d{1,};.{1,100};.{1,50};.{0,100};\d{4}/
    };    

    function getRaces(){
        raceService.getRaces().then(
            function(races){
                $scope.races = races;
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    };
    getRaces();

    function getEntryOptions(){
        adminService.getEntryOptions().then(
            function(options){
                $scope.options = options;
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    };
    getEntryOptions();

    function modifyEntries(){
        adminService.modifyEntries($scope.data.selectedEntryOption).then(
            function(response){
                notificationService.notify(response.type, response.msg);
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    };

    function deleteRaceData(raceid){
        adminService.deleteRaceData(raceid).then(
            function(response){
                notificationService.notify(response.type, response.msg);
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function deleteLicenceData(){
        adminService.deleteLicenceData().then(
            function(response){
                notificationService.notify(response.type, response.msg);
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    var open = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'views/dialog/confirmDialog.html',
            controller: 'AdminCtrl',
            scope: $scope
        });
        return modalInstance.result;
    }

    var openEntrySelector = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'views/dialog/entryListDialog.html',
            controller: 'ModalInstanceCtrl',
            scope: $scope
        });
        return modalInstance.result;
    }

    $scope.deleteRaceData = function(){
        $scope.dialogTitle = "Versenyadatok törlése";
        $scope.dialogBtnLabel = "Végrehajt";
        $scope.dialogMsg = "Biztos, hogy törli a kiválasztott versenyadatokat?";
        open().then(
            function(){ deleteRaceData($scope.data.selectedRace.id); }, 
            function(){}
        );
    }

    $scope.deleteLicenceData = function(){
        $scope.dialogTitle = "Licenszadatok törlése";
        $scope.dialogBtnLabel = "Végrehajt";
        $scope.dialogMsg = "Biztos, hogy törli az összes licenszadatot?";
        open().then(
            function(){ deleteLicenceData(); }, 
            function(){}
        );
    }

    $scope.selectEntries = function(){
        $scope.dialogTitle = "Nevezések kiválasztása";
        $scope.dialogBtnLabel = "Kiválaszt";
        openEntrySelector().then(
            function(selection){
                $scope.data.selectedEntryOption.selectedRaceId = selection.raceid;
                $scope.data.selectedEntryOption.selectedRacenums = selection.racenums;
            }, 
            function(){}
        );
    }

    $scope.processCSVLicences = function(filename){
        adminService.processCSVLicences(filename).then(
            function(response){
                notificationService.notify(response.type, response.msg);
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    $scope.modifyEntries = function(){
        modifyEntries();
    }

    $scope.modifyResult = function(){
        adminService.modifyResult($scope.data.selectedRace.id, $scope.data.result).then(
            function(response){
                notificationService.notify(response.type, response.msg);
                $scope.data.result = {};
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

}]);

tmwcapp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, entryService, notificationService) {

    $scope.races = $scope.$parent.races;  

    $scope.loadEntries = function(){
        $scope.selectedRacenums = [];
        toggleCheckboxes('[name="entry-select-all"]', false);
        if($scope.selectedRace){
            entryService.getRaceEntries($scope.selectedRace.id).then(
                function(entries){
                    $scope.entries = entries;
                },
                function(msg){
                    notificationService.notify(msg.type, msg.msg);
                }
            );
        }
    }

    $scope.toggleEntrySelection = function(racenum){
        var idx = $scope.selectedRacenums.indexOf(racenum);
        if(idx > -1){
            $scope.selectedRacenums.splice(idx, 1);
        }
        else{
            $scope.selectedRacenums.push(racenum);
        }
    }

    $scope.containsEntrySelection = function(racenum){
        return $scope.selectedRacenums.indexOf(racenum) > -1;
    }

    $scope.toggleAllSelection = function(){
        if($scope.selectedRacenums.length === 0){
            for(var i = 0; i < $scope.entries.length; ++i){
                $scope.selectedRacenums.push($scope.entries[i].key.racenum);                
            }
            toggleCheckboxes('[name="entry-select"]', true);
        }
        else{
            $scope.selectedRacenums = [];
            toggleCheckboxes('[name="entry-select"]', false);
        }
    }

    function toggleCheckboxes(selector, state){
        $(selector).each(function(index, element){
            $(this).prop("checked", state);
        });
    }

});