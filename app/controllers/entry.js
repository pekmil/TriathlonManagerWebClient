'use strict';

tmwcapp.controller('EntryCtrl', ['$scope', '$rootScope', '$routeParams', '$filter', '$location', 
                                 'entryService', 'raceService', 'parameterService', 'invoiceService', 'licenceService', 'AppConfig', '$uibModal',
  function($scope, $rootScope, $routeParams, $filter, $location, entryService, raceService, parameterService, invoiceService, licenceService, AppConfig, $uibModal) {

    $scope.popoverOptions = {
        templateUrl: 'views/partial/entryOptionsPopover.html',
        licencesTemplateUrl: 'views/partial/licencesPopover.html'
    };
    $scope.accordionOptions = {
        open : false
    };
    $scope.enterNewClub = false;    
    $scope.parameters = {
        "agegroup" : [],
        "category" : [],
        "club" : [],
        "orderedAgegroups" : [],
        "familyentry" : []
    };
    $scope.csvUploadURL = AppConfig.serviceBaseURL + 'entry/uploadcsv';
    $scope.expectedFileType = 'application/vnd.ms-excel';
    $scope.expectedFileExt = 'csv';
    $scope.expectedCSVHeader = 'name;racenum;gender;birthyear;category;fromtown;club;licencenum;agegroup;paid';
    $scope.expectedDataLinePattern = /.{1,100};[1-9]\d{0,2};(MALE|FEMALE);[1-9]\d{3};.{1,100};.{0,100};.{0,100};.{0,50};.{1,100};(IGEN|NEM|[1-9]\d{0,10})/;
    $scope.csvValidationError = true;
    $scope.entryOrderOptions = {
        orderProperty : "entrytime",
        orderReverse : true,
        orderProperties : [
            {idx : 0, name : "contestant.name"},
            {idx : 1, name : "key.racenum"},
            {idx : 10, name : "entrytime"}
        ]
    };
    $scope.entrySearchExpr = "";
    var rid = $routeParams.raceId;
    if(rid === undefined){
            
    }
    else{
        if(!$scope.selectedRace){
            raceService.getRace(rid).then(function(race){
                $scope.selectedRace = race;
            });
        }
        if($location.path().indexOf('familyentries') > -1){
            getRaceFamilyEntries(rid);
        }
        else if($location.path().indexOf('entries') > -1){
            getRaceEntries(rid);
        }        
    }

    $scope.getEntrySearchExpr = function(){
        try{
            var entrySearchObj = angular.fromJson($scope.entrySearchExpr);
            return entrySearchObj;
        }
        catch(e){
            return $scope.entrySearchExpr;
        }
    }
     
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

    $scope.setAgegroup = function(){
        if($scope.contestantForm.birthYear.$valid){
            var orderedAgegroups = $scope.parameters['orderedAgegroups'];
            var birthYear = $scope.selected.contestant.birthyear;
            var length = orderedAgegroups.length;
            var i = 1;
            for(; i < length; ++i){
                if(orderedAgegroups[i].startyear > birthYear){
                    $scope.selected.agegroup = orderedAgegroups[i-1];
                    return;
                }
                else if(i === length-1){
                    $scope.selected.agegroup = orderedAgegroups[i];
                }
            }
        }
        else{
             $scope.selected.agegroup = {};
        }
        
    }

    $scope.getParameters = function(type, refresh){
        if(!$scope.parameters[type].length || refresh){
            $scope.parameters[type] = parameterService.getParameters(type).then(
                function(parameters){
                    $scope.parameters[type] = parameters;
                    if(type === 'agegroup'){
                        $scope.parameters['orderedAgegroups'] = $filter('orderBy')(parameters, 'startyear');
                    }
                }
            );
        }
    }
    $scope.getParameters('agegroup');
    $scope.getParameters('category');
    $scope.getParameters('club');
    $scope.getParameters('familyentry');

    $scope.getInvoices = function(refresh){
        invoiceService.getInvoices(rid).then(
            function(invoices){
                $scope.invoices = invoices;
            }
        );
    }
    $scope.getInvoices();

    $scope.toggleNewClub = function(){
        $scope.enterNewClub = !$scope.enterNewClub;
    }

    $scope.toggleNewInvoice = function(){
        $scope.enterNewInvoice = !$scope.enterNewInvoice;
        if($scope.enterNewInvoice && $scope.selected.invoice){
            $scope.selected.invoice.id = null;
        }
    }

    function getRaceEntries(raceId){
        entryService.getRaceEntries(raceId).then(
            function(entries){
                $scope.entries = entries;
            },
            function(error){
                notify('error', error);
            }
        );
    }

    $scope.getRaceEntries = function(raceId){
        getRaceEntries(raceId);
    }

    function getRaceFamilyEntries(raceId){
        entryService.getRaceFamilyEntries(raceId).then(
            function(familyentries){
                $scope.familyentries = familyentries;
            },
            function(error){
                notify('error', error);
            }
        );
    }

    $scope.results = {
        selectedCategory : null,
        national : false,
        nationalResults : false,
        absolute : false,
        team : false,
        family : false
    }
    $scope.getRaceResults = function(){
        entryService.getRaceResults(rid, $scope.results).then(
            function(results){
                $scope.results.raceresults = results;
            },
            function(error){
                notify('error', error);
            }
        );
    }
    $scope.isMedalist = function(index, result){
        return index < 3;
    }
    $scope.selectResultType = function(type){
        if(type === "absolute"){$scope.results.team = false;$scope.results.family = false;}
        else if(type === "family"){$scope.results.team = false;$scope.results.absolute = false;$scope.selectedCategory = null}
        else if(type === "team"){$scope.results.absolute = false;$scope.results.family = false;}
    }
    $scope.filterNationalResults = function(result){
        return !$scope.results.nationalResults || result.licencenum;
    }

    $scope.processCSVEntries = function(){
        entryService.processCSVEntries(rid, $scope.lastUploadedFileName).then(
            function(response){
                notify('success', 'Beolvasott rekordok: ' + response);
                getRaceEntries(rid);
            },
            function(error){
                notify('error', error);
            }
        );
    }

    function updateEntry(){
        entryService.updateEntry($scope.selected).then(
            function(response){
                getRaceEntries(rid);
            },
            function(error){
                notify('error', error);
            }
        );
    }

    function updateContestant(){
        entryService.updateContestant($scope.selected.contestant).then(
            function(response){
                getRaceEntries(rid);
            },
            function(error){
                notify('error', error);
            }
        );
    }

    function createEntry(){
        entryService.createEntry(rid, $scope.selected).then(
            function(response){
                getRaceEntries(rid);
            },
            function(error){
                notify('error', error);
            }
        );
    }

    function deleteEntry(){
        entryService.deleteEntry($scope.selected).then(
            function(response){
                getRaceEntries(rid);
            },
            function(error){
                notify('error', error);
            }
        );
    }

    $scope.loadLicenceData = function(){
        if($scope.selected.licencenum){
            licenceService.getLicence($scope.selected.licencenum).then(
                function(licences){
                    $scope.licences = licences;
                },
                function(error){
                    notify(error.type, error.msg);
                }
            );
        }
    }

    var open = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'views/dialog/entryDialog.html',
            controller: 'EntryCtrl',
            scope: $scope
        });
        return modalInstance.result;
    }

    var openInvoice = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'views/dialog/invoiceDialog.html',
            controller: 'EntryCtrl',
            scope: $scope
        });
        return modalInstance.result;
    }

    var openFamilyEntry = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'views/dialog/familyentryDialog.html',
            controller: 'EntryCtrl',
            scope: $scope
        });
        return modalInstance.result;
    }

    $scope.setInvoice = function(entry){
        $scope.selected = angular.copy(entry);
        $scope.dialogTitle = "Számla";
        $scope.dialogBtnLabel = "Rögzít";
        $scope.invoiceMode = "SET"
        openInvoice().then(
            function(){ updateEntry(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.unsetInvoice = function(){
        if($scope.selected.invoice){
            delete $scope.selected.invoice;
        }
    }

    $scope.setFamilyEntry = function(entry){
        $scope.selected = angular.copy(entry);
        $scope.dialogTitle = "Családi nevezés";
        $scope.dialogBtnLabel = "Rögzít";
        openFamilyEntry().then(
            function(){ updateEntry(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.unsetFamilyEntry = function(){
        if($scope.selected.familyentry){
            delete $scope.selected.familyentry;
        }
    }

    $scope.create = function(){
        $scope.mode = "CREATE";
        $scope.selected = {};
        $scope.dialogTitle = "Nevezés hozzáadása";
        $scope.dialogBtnLabel = "Hozzáad";
        open().then(
            function(){ createEntry(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.edit = function(entry){
        $scope.mode = "UPDATE";
        $scope.dialogTitle = "Nevezés módosítása";
        $scope.dialogBtnLabel = "Mentés";
        $scope.selected = angular.copy(entry);
        open().then(
            function(){ updateContestant(); updateEntry(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.delete = function(entry){
        $scope.mode = "DELETE";
        $scope.dialogTitle = "Nevezés törlése";
        $scope.dialogBtnLabel = "Törlés";
        $scope.selected = angular.copy(entry);
        open().then(
            function(){ deleteEntry(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.changeStatus = function(entry, newstatus){
        $scope.selected = angular.copy(entry);
        $scope.selected.status = newstatus;
        updateEntry();
    }

    $scope.pay = function(entry){
        $scope.selected = angular.copy(entry);
        $scope.selected.paid = true;
        $scope.selected.remainingpayment = 0;
        updateEntry();
    }

    function notify(type, msg){
        $rootScope.$broadcast('notificationEvent', { type: type, msg: msg });
    }

  }]);