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

tmwcapp.controller('ParameterCtrl', ['$scope', '$rootScope', 'parameterService', '$uibModal',
  function ($scope, $rootScope, parameterService, $uibModal) {

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
            function(error){
                alert(error);
            }
        );
    }

    function deleteParameter(type){
        parameterService.deleteParameter(type, $scope.selected).then(
            function(response){
                getParameters(type);
            },
            function(error){
                alert(error);
            }
        );
    }

    function createParameter(type){
        parameterService.createParameter(type, $scope.selected).then(
            function(response){
                getParameters(type);
            },
            function(error){
                alert(error);
            }
        );
    }

    function updateParameter(type){
        parameterService.updateParameter(type, $scope.selected).then(
            function(response){
                getParameters(type);
            },
            function(error){
                alert(error);
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
            function(error){
                alert(error);
            }
        );
    }

    $scope.decrementAgegroupYears = function(){
        parameterService.decrementAgegroupYears().then(
            function(response){
                getParameters('agegroup');
            },
            function(error){
                alert(error);
            }
        );
    }

     function alert(error){
        $rootScope.$broadcast('notificationEvent', { type: 'danger', msg: error });
    }
  
}]);

tmwcapp.controller('ResultCtrl', ['$scope', '$rootScope', '$routeParams', 'entryService', 'raceService', 'focus', '$uibModal',
  function ($scope, $rootScope, $routeParams, entryService, raceService, focus, $uibModal) {

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

    var rid = $routeParams.raceId;
    if(rid === undefined){
            
    }
    else{
        getResults(rid);
        raceService.getRace(rid).then(function(race){$scope.selectedRace = race;})        
    }

    function getResults(raceId){
        focus('result-racenum');
        entryService.getFinishedResults(raceId).then(
            function(results){
                $scope.results = results;
            },
            function(error){
                alert(error);
            }
        );
    }

    $scope.getResults = function(raceId){
        getResults(raceId);
    }

    $scope.postResult = function(){
        entryService.postResult(rid, $scope.result).then(
            function(response){
                getResults(rid);
                $scope.result.racenum = null;
                $scope.result.racetime = null;
                focus('result-racenum');
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

tmwcapp.controller('InvoiceCtrl', ['$scope', '$rootScope', '$routeParams', '$filter', 'invoiceService', 'raceService', 'AppConfig', '$uibModal',
  function ($scope, $rootScope, $routeParams, $filter, invoiceService, raceService, AppConfig, $uibModal) {

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
            function(error){
                alert(error);
            }
        );
    }

    function deleteInvoice(){
        invoiceService.deleteInvoice($scope.selected.invoice).then(
            function(response){
                getInvoices(rid);
            },
            function(error){
                alert(error);
            }
        );
    }

    function updateInvoice(){
        invoiceService.updateInvoice($scope.selected.invoice).then(
            function(response){
                getInvoices(rid);
            },
            function(error){
                alert(error);
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

     function alert(error){
        $rootScope.$broadcast('notificationEvent', { type: 'danger', msg: error });
    }
  
}]);

tmwcapp.controller('AuthCtrl', ['$scope', '$rootScope', 'authService', '$uibModal',
  function ($scope, $rootScope, authService, $uibModal) {

    $scope.iconTitle = "Bejelentkezés";

    isLoggedIn(false);

    function isLoggedIn(silent){
        authService.status().then(
            function(data){
                $scope.username = data.params.username;
                $scope.iconTitle = "Kijelentkezés";
                if(!silent) notify(data.type, data.msg);
            },
            function(error){
                if(!silent) notify(error.type, error.msg);
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
                notify(response.type, response.msg);
            },
            function(error){
                $scope.iconTitle = "Bejelentkezés";
                $scope.username = null;
                notify(error.type, error.msg);
            }
        );
    }

    function doLogout(){
        authService.logout().then(
            function(response){
                $scope.username = null;
                $scope.iconTitle = "Bejelentkezés";
                notify(response.type, response.msg);
            },
            function(error){
                $scope.iconTitle = "Kijelentkezés";
                notify(error.type, error.msg);
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

    function notify(type, msg){
        $rootScope.$broadcast('notificationEvent', { type: type, msg: msg });
    }
  
}]);

tmwcapp.controller('LicenceCtrl', ['$scope', '$rootScope', 'licenceService',
  function ($scope, $rootScope, licenceService) {

    $scope.namePart = "";
    $scope.licencePart = "";

    $scope.pagination = {
        currentPage : 1,
        itemsPerPage : 100,
        totalItems : 0
    }

    $scope.loadPageData = function(){
        var from = ($scope.pagination.currentPage - 1) * $scope.pagination.itemsPerPage;
        var to = from + $scope.pagination.itemsPerPage - 1;
        $scope.getLicences(from, to);
    }

    $scope.getLicences = function(from, to){
        $scope.namePart = "";
        $scope.licencePart = "";
        licenceService.getLicences(from, to).then(
            function(licences){
                $scope.licences = licences.data;
                $scope.pagination.totalItems = licences.count;
            },
            function(error){
                notify(error.type, error.msg);
            }
        );
    }
    $scope.getLicences(0, $scope.pagination.itemsPerPage - 1);

    $scope.findByName = function(namePart){
        $scope.licencePart = "";
        if(namePart.length < 3) return;
        licenceService.findByName(namePart).then(
            function(licences){
                $scope.licences = licences;
            },
            function(error){
                notify(error.type, error.msg);
            }
        );
    }

    $scope.findByLicence = function(licencePart){
        $scope.namePart = "";
        licenceService.findByLicence(licencePart).then(
            function(licences){
                $scope.licences = licences;
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