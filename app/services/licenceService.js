'use strict';

tmwcapp.service('licenceService', ['$http', '$q', 'AppConfig',
  function($http, $q, AppConfig){
  
    var serviceURL = AppConfig.serviceBaseURL + "licence";

    return ({
        getLicences : getLicences,
        findByName : findByName,
        findByLicence : findByLicence,
        licenceExists : licenceExists,
        updateLicence : updateLicence,
        createLicence : createLicence,
        deleteLicence : deleteLicence
    });

     function updateLicence(licence) {
        var request = $http({
            method: "PUT",
            url: serviceURL + '/' + licence.id,
            data: invoice
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function createLicence(licence) {
        var request = $http({
            method: "POST",
            url: serviceURL,
            data: licence
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function deleteLicence(licence) {
        var request = $http({
            method: "DELETE",
            url: serviceURL + '/' + licence.id
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function getLicences(from, to) {
        var request = $http({
            method: "GET",
            url: serviceURL + '/' + from + '/' + to,
        });
        return(request.then(handleSuccess, handleError));
    }

    function findByName(namePart) {
        var request = $http({
            method: "GET",
            url: serviceURL + '/findbyname/' + encodeURIComponent(namePart)
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function findByLicence(licencePart) {
        var request = $http({
            method: "GET",
            url: serviceURL + '/findbylicence/' + encodeURIComponent(licencePart)
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function licenceExists(licence){
        var request = $http({
            method: "GET",
            url: serviceURL + '/licenceexists/' + encodeURIComponent(licence)
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function handleError( response ) {
        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (!angular.isObject( response.data ) || !response.data.msg){
            return($q.reject("Hiba: " + response.status + " - " + response.statusText));
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