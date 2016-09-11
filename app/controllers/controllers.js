'use strict';

tmwcapp.controller('NotificationCtrl', function ($scope) {

  $scope.alerts = [];

  $scope.$on('notificationEvent', function(event, alert) {
  	addAlert(alert);
  });

  var addAlert = function(alert) {
    $scope.alerts.push(alert);
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
  
});

tmwcapp.controller('WelcomeCtrl', function ($scope, AppConfig) {

  $scope.carouselImages = AppConfig.carouselImages;  
  
});

tmwcapp.controller('ParameterCtrl', ['$scope', '$rootScope', 'parameterService', '$uibModal', 'notificationService',
  function ($scope, $rootScope, parameterService, $uibModal, notificationService) {

    getParameters("category");
    getParameters("agegroup");
    getParameters("club");
    getParameters("familyentry");

    function getParameters(type){
        parameterService.getParameters(type).then(
            function(parameters){
                if(type === 'agegroup'){
                  $scope.agegroups = parameters;
                }
                else if(type === 'category'){
                  $scope.categories = parameters;
                }
                else if(type === 'club'){
                  $scope.clubs = parameters;
                }
                else if(type === 'familyentry'){
                  $scope.families = parameters;
                }
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function deleteParameter(type){
        parameterService.deleteParameter(type, $scope.selected).then(
            function(response){
                getParameters(type);
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function createParameter(type){
        parameterService.createParameter(type, $scope.selected).then(
            function(response){
                getParameters(type);
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function updateParameter(type){
        parameterService.updateParameter(type, $scope.selected).then(
            function(response){
                getParameters(type);
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    var open = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'views/dialog/parameterDialog.html',
            controller: 'ParameterCtrl',
            scope: $scope
        });
        return modalInstance.result;
    }

    $scope.delete = function(type, parameter){
        $scope.type = type;
        $scope.editMode = false;
        $scope.dialogTitle = "Paraméter törlése";
        $scope.dialogBtnLabel = "Törlés";
        $scope.selected = parameter;
        open().then(
            function(){ deleteParameter(type); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.edit = function(type, parameter){
        $scope.type = type;
        $scope.editMode = true;
        $scope.dialogTitle = "Paraméter módosítása";
        $scope.dialogBtnLabel = "Mentés";
        $scope.selected = angular.copy(parameter);
        open().then(
            function(){ updateParameter(type); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.create = function(type){
        $scope.type = type;
        $scope.editMode = true;
        $scope.dialogTitle = "Paraméter hozzáadása";
        $scope.dialogBtnLabel = "Hozzáad";
        $scope.selected = {};
        open().then(
            function(){ createParameter(type); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.incrementAgegroupYears = function(){
        parameterService.incrementAgegroupYears().then(
            function(response){
                getParameters('agegroup');
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    $scope.decrementAgegroupYears = function(){
        parameterService.decrementAgegroupYears().then(
            function(response){
                getParameters('agegroup');
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }
  
}]);

tmwcapp.controller('ResultCtrl', ['$scope', '$rootScope', '$routeParams', 'entryService', 'raceService', 'resultmodService', 'focus', '$uibModal', 'notificationService',
  function ($scope, $rootScope, $routeParams, entryService, raceService, resultmodService, focus, $uibModal, notificationService) {

    $scope.resultOrderOptions = {
        orderProperty : "finishtime",
        orderReverse : true,
        orderProperties : [
            {idx : 0, name : "contestant.name"},
            {idx : 1, name : "key.racenum"},
            {idx : 2, name : "racetime"},
            {idx : 3, name : "finishtime"}
        ]
    };
    $scope.popoverOptions = {
        templateUrl: 'views/partial/racetimemodsPopover.html',
    }

    var rid = $routeParams.raceId;
    if(rid === undefined){
            
    }
    else{
        getResults(rid);
        raceService.getRace(rid).then(function(race){$scope.selectedRace = race;})        
    }

    $scope.result = {
        racenum : null,
        racetime : null,
        resultmodIds : [],
        rollback : false
    }

    function getResults(raceId){
        focus('result-racenum');
        entryService.getFinishedResults(raceId).then(
            function(results){
                $scope.results = results;
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function getResultmods(){
        resultmodService.getResultmods().then(
            function(resultmods){
                $scope.resultmods = resultmods;
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }
    getResultmods();

    $scope.getResults = function(raceId){
        getResults(raceId);
    }

    $scope.postResult = function(){
        entryService.postResult(rid, $scope.result).then(
            function(response){
                getResults(rid);
                $scope.result.racenum = null;
                $scope.result.racetime = null;
                $scope.result.resultmodIds = [];
                $scope.result.rollback = false;
                focus('result-racenum');
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    $scope.applyResultmod = function(racenum, idname, rollback){
        $scope.result.racenum = racenum;
        $scope.result.racetime = null;
        $scope.result.resultmodIds = [idname];
        $scope.result.rollback = rollback;
        entryService.applyResultmod(rid, $scope.result).then(
            function(response){
                getResults(rid);
                $scope.result.racenum = null;
                $scope.result.racetime = null;
                $scope.result.resultmodIds = [];
                $scope.result.rollback = false;
                focus('result-racenum');
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    $scope.toggleResultmodSelection = function(idname){
        var idx = $scope.result.resultmodIds.indexOf(idname);
        if(idx > -1){
            $scope.result.resultmodIds.splice(idname, 1);
        }
        else{
            $scope.result.resultmodIds.push(idname);
        }
    }

    $scope.containsResultmodSelection = function(idname){
        return $scope.result.resultmodIds.indexOf(idname) > -1;
    }
  
}]);

tmwcapp.controller('InvoiceCtrl', ['$scope', '$rootScope', '$routeParams', '$filter', 'invoiceService', 'raceService', 'AppConfig', '$uibModal', 'notificationService',
  function ($scope, $rootScope, $routeParams, $filter, invoiceService, raceService, AppConfig, $uibModal, notificationService) {

    $scope.entryFees = AppConfig.entryFees;

    var rid = $routeParams.raceId;
    if(rid === undefined){
            
    }
    else{
        $scope.raceId = rid;
        getInvoices(rid);
    }

    $scope.invoiceTotal = function(invoice){
        var entries = $filter('filter')(invoice.entries, {key : {raceId : rid}});
        var total = 0;
        for(var i = 0; i < entries.length; i++){
            var price = 0;
            var entry = entries[i];
            var fee = $scope.entryFees[entry.categoryName];
            if(entry.preentry) price = fee.pre;
            else price = fee.normal;
            total += price;
        };
        return total;
    }

    function getInvoices(rid){
        invoiceService.getInvoices(rid).then(
            function(invoices){
                $scope.invoices = invoices;
                if(!$scope.selectedRace){
                    raceService.getRace(rid).then(function(race){
                        $scope.selectedRace = race;
                    });
                }
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function deleteInvoice(){
        invoiceService.deleteInvoice($scope.selected.invoice).then(
            function(response){
                getInvoices(rid);
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function updateInvoice(){
        invoiceService.updateInvoice($scope.selected.invoice).then(
            function(response){
                getInvoices(rid);
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    var open = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'views/dialog/invoiceDialog.html',
            controller: 'InvoiceCtrl',
            scope: $scope
        });
        return modalInstance.result;
    }

    $scope.delete = function(invoice){        
        $scope.invoiceMode = "DELETE";
        $scope.dialogTitle = "Számla igény törlése";
        $scope.dialogBtnLabel = "Törlés";
        $scope.selected = {};
        $scope.selected.invoice = invoice;
        open().then(
            function(){ deleteInvoice(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.edit = function(invoice){        
        $scope.invoiceMode = "UPDATE";
        $scope.dialogTitle = "Számla igény módosítása";
        $scope.dialogBtnLabel = "Mentés";
        $scope.selected = {
            invoice : angular.copy(invoice)
        };  
        open().then(
            function(){ updateInvoice(); }, 
            function(){ $scope.selected = {}; }
        );
    }
  
}]);

tmwcapp.controller('AuthCtrl', ['$scope', '$rootScope', 'authService', '$uibModal', 'notificationService',
  function ($scope, $rootScope, authService, $uibModal, notificationService) {

    $scope.iconTitle = "Bejelentkezés";

    isLoggedIn(false);

    function isLoggedIn(silent){
        authService.status().then(
            function(data){
                $scope.username = data.params.username;
                $scope.iconTitle = "Kijelentkezés";
                if(!silent) notificationService.notify(data.type, data.msg);
            },
            function(error){
                if(!silent) notificationService.notify(error.type, error.msg);
                $scope.iconTitle = "Bejelentkezés";
                $scope.username = null;
            }
        );
    }

    function doLogin(userdata){
        authService.login(userdata).then(
            function(response){
                $scope.username = response.params.username;
                $scope.iconTitle = "Kijelentkezés";
                notificationService.notify(response.type, response.msg);
            },
            function(error){
                $scope.iconTitle = "Bejelentkezés";
                $scope.username = null;
                notificationService.notify(error.type, error.msg);
            }
        );
    }

    function doLogout(){
        authService.logout().then(
            function(response){
                $scope.username = null;
                $scope.iconTitle = "Bejelentkezés";
                notificationService.notify(response.type, response.msg);
            },
            function(error){
                $scope.iconTitle = "Kijelentkezés";
                notificationService.notify(error.type, error.msg);
            }
        );
    }

    var open = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'views/dialog/loginDialog.html',
            controller: 'AuthCtrl',
            scope: $scope
        });
        return modalInstance.result;
    }

    $scope.auth = function(){
        isLoggedIn(true);
        if($scope.username){
            doLogout();
        }
        else{            
            $scope.dialogTitle = "Bejelentkezés";
            $scope.dialogBtnLabel = "Belép";
            $scope.userdata = {};
            open().then(
                function(){ doLogin($scope.userdata); $scope.userdata = {};}, 
                function(){ $scope.userdata = {}; }
            );
        }        
    }
  
}]);

tmwcapp.controller('ResultmodCtrl', ['$scope', '$rootScope', 'resultmodService', 'AppConfig', '$uibModal', 'notificationService',
  function ($scope, $rootScope, resultmodService, AppConfig, $uibModal, notificationService) {

    $scope.getResultmods = function(){
        resultmodService.getResultmods().then(
            function(resultmods){
                $scope.resultmods = resultmods;
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function deleteResultmod(){
        resultmodService.deleteResultmod($scope.selected).then(
            function(response){
                $scope.getResultmods();
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function updateResultmod(){
        resultmodService.updateResultmod($scope.selected).then(
            function(response){
                $scope.getResultmods();
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function createResultmod(){
        resultmodService.createResultmod($scope.selected).then(
            function(response){
                $scope.getResultmods();
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    var open = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'views/dialog/resultmodDialog.html',
            controller: 'ResultmodCtrl',
            scope: $scope
        });
        return modalInstance.result;
    }

    $scope.delete = function(resultmod){
        $scope.dialogMode = "DELETE";
        $scope.dialogTitle = "Időeredmény módosítás törlése";
        $scope.dialogBtnLabel = "Törlés";
        $scope.selected = angular.copy(resultmod);
        open().then(
            function(){ deleteResultmod(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.edit = function(resultmod){
        $scope.dialogMode = "UPDATE";
        $scope.dialogTitle = "Időeredmény módosítás módosítása";
        $scope.dialogBtnLabel = "Mentés";
        $scope.selected = angular.copy(resultmod);
        open().then(
            function(){ updateResultmod(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.create = function(){
        $scope.dialogMode = "CREATE";
        $scope.dialogTitle = "Időeredmény módosítás létrehozása";
        $scope.dialogBtnLabel = "Mentés";
        $scope.selected = {};
        open().then(
            function(){ createResultmod(); }, 
            function(){ $scope.selected = {}; }
        );
    }
  
}]);