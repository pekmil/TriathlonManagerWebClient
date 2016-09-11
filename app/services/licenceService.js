'use strict';

tmwcapp.service('licenceService', ['$http', '$q', 'AppConfig', 'responseHandler',
  function($http, $q, AppConfig, responseHandler){
  
    var serviceURL = AppConfig.serviceBaseURL + "licence";

    return ({
        getLicences : getLicences,
        findByName : findByName,
        findByLicence : findByLicence,
        licenceExists : licenceExists,
        updateLicence : updateLicence,
        createLicence : createLicence,
        deleteLicence : deleteLicence,
        getLicence : getLicence
    });

     function updateLicence(licence) {
        var request = {
            method: "PUT",
            url: serviceURL + '/' + licence.id,
            data: licence
        };
        return responseHandler.handle(request);
    }

    function createLicence(licence) {
        var request = {
            method: "POST",
            url: serviceURL,
            data: licence
        };
        return responseHandler.handle(request);
    }
    
    function deleteLicence(licence) {
        var request = {
            method: "DELETE",
            url: serviceURL + '/' + licence.id
        };
        return responseHandler.handle(request);
    }
    
    function getLicences(from, to) {
        var request = {
            method: "GET",
            url: serviceURL + '/' + from + '/' + to,
        };
        return responseHandler.handle(request);
    }

    function getLicence(licence) {
        var request = {
            method: "GET",
            url: serviceURL + '/' + encodeURIComponent(licence)
        };
        return responseHandler.handle(request);
    }

    function findByName(namePart) {
        var request = {
            method: "GET",
            url: serviceURL + '/findbyname/' + encodeURIComponent(namePart)
        };
        return responseHandler.handle(request);
    }

    function findByLicence(licencePart) {
        var request = {
            method: "GET",
            url: serviceURL + '/findbylicence/' + encodeURIComponent(licencePart)
        };
        return responseHandler.handle(request);
    }

    function licenceExists(licence){
        var request = {
            method: "GET",
            url: serviceURL + '/licenceexists/' + encodeURIComponent(licence)
        };
        return responseHandler.handle(request);
    }
    
  }]);