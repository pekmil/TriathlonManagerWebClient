'use strict';

tmwcapp.controller('AdminCtrl', ['$scope', '$rootScope', 'adminService', 'raceService', 'entryService', 'AppConfig', '$uibModal',
  function($scope, $rootScope, adminService, raceService, entryService, AppConfig, $uibModal) {
    
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
    $scope.csvUploadURL = AppConfig.serviceBaseURL + 'licence/uploadcsv';
    $scope.expectedFileType = 'application/vnd.ms-excel';
    $scope.expectedFileExt = 'csv';
    $scope.expectedCSVHeader = 'l_id;l_name;l_licencenum;l_birthplace;l_birthyear';
    $scope.expectedDataLinePattern = /\d{1,};.{1,100};.{1,50};.{0,100};\d{4}/;
    $scope.csvValidationError = true;

    $scope.csvUploadError = function(response){
        if(angular.isObject(response.data)){
            notify(response.data.type, response.data.msg + '\n' + response.data.params.errorMsg);
            $scope.lastUploadedFileName = null;
        }
    }

    $scope.csvUploadSuccess = function(response){
        if(angular.isObject(response.data)){
            notify(response.data.type, response.data.msg);
            $scope.lastUploadedFileName = response.data.params.uploadFileName;
        }
    }

    $scope.csvValidateContent = function(file){
        var reader = new FileReader();
        if(file.type !== $scope.expectedFileType || !file.name.endsWith($scope.expectedFileExt)){
            notify('warning', 'A kiválasztott fájl formátuma nem megfelelő!');
            return;
        }
        reader.onload = function(onLoadEvent) {
            var lines = onLoadEvent.target.result.split('\n');
            if(lines.length && !lines[0].match($scope.expectedCSVHeader)){
                $scope.$apply(function(){
                    notify('warning', 'Nem megfelelő fejléc sor a kiválasztott fájlban!');
                });
                return;
            }
            var count = 0;
            for(var i = 1; i <= lines.length - 1; ++i){
                var line = lines[i];
                if(!line.match($scope.expectedDataLinePattern)){
                    $scope.$apply(function(){
                        notify('warning', 'Hibás adatsor:\n' + line);
                    });
                    return;                    
                }
                ++count;
            };
            $scope.csvValidationError = false;
            $scope.$apply(function(){
                notify('success', 'Adatsorok elenőrzése sikeres! (' + count + ' db)');
            });
        };
        reader.onloadstart = function(onLoadStartEvent){
            $scope.$apply(function(){
                $rootScope.$broadcast("loader_show");
            });
        };
        reader.onloadend = function(onLoadEndEvent){
            $scope.$apply(function(){
                $rootScope.$broadcast("loader_hide");
            });
        };
        reader.readAsText(file);
    }

    function getRaces(){
        raceService.getRaces().then(
            function(races){
                $scope.races = races;
            },
            function(error){
                notify(error.type, error.msg);
            }
        );
    };
    getRaces();

    function getEntryOptions(){
        adminService.getEntryOptions().then(
            function(options){
                $scope.options = options;
            },
            function(error){
                notify(error.type, error.msg);
            }
        );
    };
    getEntryOptions();

    function modifyEntries(){
        adminService.modifyEntries($scope.data.selectedEntryOption).then(
            function(response){
                notify(response.type, response.msg);
            },
            function(error){
                notify(error.type, error.msg);
            }
        );
    };

    function deleteRaceData(raceid){
        adminService.deleteRaceData(raceid).then(
            function(response){
                notify(response.type, response.msg);
            },
            function(error){
                notify(error.type, error.msg);
            }
        );
    }

    function deleteLicenceData(){
        adminService.deleteLicenceData().then(
            function(response){
                notify(response.type, response.msg);
            },
            function(error){
                notify(error.type, error.msg);
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

    $scope.processCSVLicences = function(){
        adminService.processCSVLicences($scope.lastUploadedFileName).then(
            function(response){
                notify(response.type, response.msg);
            },
            function(error){
                notify('error', error);
            }
        );
    }

    $scope.modifyEntries = function(){
        modifyEntries();
    }

    $scope.modifyResult = function(){
        adminService.modifyResult($scope.data.selectedRace.id, $scope.data.result).then(
            function(response){
                notify(response.type, response.msg);
                $scope.data.result = {};
            },
            function(error){
                notify(error.type, error.msg);
            }
        );
    }

    function notify(type, msg){
        $rootScope.$broadcast('notificationEvent', { type: type, msg: msg });
    }

}]);

tmwcapp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, entryService) {

    $scope.races = $scope.$parent.races;  

    $scope.loadEntries = function(){
        $scope.selectedRacenums = [];
        toggleCheckboxes('[name="entry-select-all"]', false);
        if($scope.selectedRace){
            entryService.getRaceEntries($scope.selectedRace.id).then(
                function(entries){
                    $scope.entries = entries;
                },
                function(error){
                    notify(error.type, error.msg);
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