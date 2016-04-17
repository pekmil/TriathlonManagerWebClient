'use strict';

tmwcapp.service('adminService', ['$http', '$q', 'AppConfig',
  function($http, $q, AppConfig){
  
    var serviceURL = AppConfig.serviceBaseURL + "admin";

    return ({
        deleteRaceData : deleteRaceData,
        getEntryOptions : getEntryOptions,
        modifyEntries : modifyEntries,
        processCSVLicences : processCSVLicences,
        deleteLicenceData : deleteLicenceData
	});

    function deleteRaceData(raceId) {
        var request = $http({
            method: "DELETE",
            url: serviceURL + '/deleteracedata/' + raceId
        });
        return(request.then(handleSuccess, handleError));
    }

    function getEntryOptions() {
        var request = $http({
            method: "GET",
            url: serviceURL + '/entryoptions/'
        });
        return(request.then(handleSuccess, handleError));
    }

    function modifyEntries(entryOption) {
        var request = $http({
            method: "POST",
            url: serviceURL + '/modifyentries/',
            data : entryOption
        });
        return(request.then(handleSuccess, handleError));
    }

     function processCSVLicences(uploadedFileName){
        var request = $http({
            method : 'POST',
            url : serviceURL + '/loadlicencedata/',
            data : $.param({filename : uploadedFileName}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function deleteLicenceData() {
        var request = $http({
            method: "DELETE",
            url: serviceURL + '/deletelicencedata/'
        });
        return(request.then(handleSuccess, handleError));
    }

    function handleError( response ) {
        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (!angular.isObject( response.data ) || !response.data.msg){
            return($q.reject({type : "error", msg : "Hiba: " + response.status + " - " + response.statusText}));
        }
        // Otherwise, use expected error message.
        return( $q.reject( response.data ) );
    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    function handleSuccess( response ) {
        return( response.data );
    }
	
  }]);