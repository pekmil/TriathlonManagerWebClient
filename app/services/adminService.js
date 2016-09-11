'use strict';

tmwcapp.service('adminService', ['$http', '$q', 'AppConfig', 'responseHandler',
  function($http, $q, AppConfig, responseHandler){
  
    var serviceURL = AppConfig.serviceBaseURL + "admin";

    return ({
        deleteRaceData : deleteRaceData,
        getEntryOptions : getEntryOptions,
        modifyEntries : modifyEntries,
        processCSVLicences : processCSVLicences,
        deleteLicenceData : deleteLicenceData,
        modifyResult : modifyResult
	});

    function deleteRaceData(raceId) {
        var request = {
            method: "DELETE",
            url: serviceURL + '/deleteracedata/' + raceId
        };
        return responseHandler.handle(request);
    }

    function getEntryOptions() {
        var request = {
            method: "GET",
            url: serviceURL + '/entryoptions/'
        };
        return responseHandler.handle(request);
    }

    function modifyEntries(entryOption) {
        var request = {
            method: "POST",
            url: serviceURL + '/modifyentries/',
            data : entryOption
        };
        return responseHandler.handle(request);
    }

     function processCSVLicences(uploadedFileName){
        var request = {
            method : 'POST',
            url : serviceURL + '/loadlicencedata/',
            data : $.param({filename : uploadedFileName}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        };
        return responseHandler.handle(request);
    }

    function deleteLicenceData() {
        var request = {
            method: "DELETE",
            url: serviceURL + '/deletelicencedata/'
        };
        return responseHandler.handle(request);
    }

    function modifyResult(raceId, resultData) {
        var request = {
            method: "POST",
            url: serviceURL + '/modifyresult/' + raceId,
            data: resultData
        };
        return responseHandler.handle(request);
    }
	
  }]);