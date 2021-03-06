'use strict';

tmwcapp.controller('LicenceCtrl', ['$scope', '$rootScope', 'licenceService', '$uibModal', 'notificationService',
  function ($scope, $rootScope, licenceService, $uibModal, notificationService) {

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
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    $scope.findByName = function(namePart){
        $scope.licencePart = "";
        if(namePart.length < 3) return;
        licenceService.findByName(namePart).then(
            function(licences){
                $scope.licences = licences;
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    $scope.findByLicence = function(licencePart){
        $scope.namePart = "";
        licenceService.findByLicence(licencePart).then(
            function(licences){
                $scope.licences = licences;
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function updateLicence(){
        licenceService.updateLicence($scope.selected).then(
            function(response){
                $scope.loadPageData();
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function createLicence(){
        licenceService.createLicence($scope.selected).then(
            function(response){
                $scope.loadPageData();
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    function deleteLicence(){
        licenceService.deleteLicence($scope.selected).then(
            function(response){
                $scope.loadPageData();
            },
            function(msg){
                notificationService.notify(msg.type, msg.msg);
            }
        );
    }

    var open = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'views/dialog/licenceDialog.html',
            controller: 'LicenceCtrl',
            scope: $scope
        });
        return modalInstance.result;
    }

    $scope.create = function(){
        $scope.mode = "CREATE";
        $scope.selected = {};
        $scope.dialogTitle = "Licensz hozzáadása";
        $scope.dialogBtnLabel = "Hozzáad";
        open().then(
            function(){ createLicence(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.edit = function(licence){
        $scope.mode = "UPDATE";
        $scope.dialogTitle = "Licensz módosítása";
        $scope.dialogBtnLabel = "Mentés";
        $scope.selected = angular.copy(licence);
        open().then(
            function(){ updateLicence(); }, 
            function(){ $scope.selected = {}; }
        );
    }

    $scope.delete = function(licence){
        $scope.mode = "DELETE";
        $scope.dialogTitle = "Licensz törlése";
        $scope.dialogBtnLabel = "Törlés";
        $scope.selected = angular.copy(licence);
        open().then(
            function(){ deleteLicence(); }, 
            function(){ $scope.selected = {}; }
        );
    }
  
}]);