'use strict';

tmwcapp.factory('focus', function($timeout, $window) {
    return function(id) {
      $timeout(function() {
        var element = $window.document.getElementById(id);
        if(element)
          element.focus();
      });
    };
  });

tmwcapp.service('parameterService', ['$http', '$q', 'AppConfig',
  function($http, $q, AppConfig){
  
    var serviceBaseURL = AppConfig.serviceBaseURL;

    return ({
		getParameters: getParameters,
        updateParameter: updateParameter,
        createParameter: createParameter,
        deleteParameter: deleteParameter,
        incrementAgegroupYears : incrementAgegroupYears,
        decrementAgegroupYears : decrementAgegroupYears
	});
	
	function getParameters(type) {
        var request = $http({
            method: "GET",
            url: serviceBaseURL + type
        });
        return(request.then(handleSuccess, handleError));
    }

    function updateParameter(type, parameter) {
        var request = $http({
            method: "PUT",
            url: serviceBaseURL + type + '/' + parameter.id,
            data: parameter
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function createParameter(type, parameter) {
        var request = $http({
            method: "POST",
            url: serviceBaseURL + type,
            data: parameter
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function deleteParameter(type, parameter) {
        var request = $http({
            method: "DELETE",
            url: serviceBaseURL + type + '/' + parameter.id
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function incrementAgegroupYears() {
        var request = $http({
            method: "PUT",
            url: serviceBaseURL + 'agegroup/incrementyears',
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function decrementAgegroupYears() {
        var request = $http({
            method: "PUT",
            url: serviceBaseURL + 'agegroup/decrementyears',
        });
        return( request.then( handleSuccess, handleError ) );
    }

     function handleError( response ) {
        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (!angular.isObject( response.data ) || !response.data.message){
            return($q.reject("Hiba: " + response.status + " - " + response.statusText));
        }
        // Otherwise, use expected error message.
        return( $q.reject( response.data.message ) );
    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    function handleSuccess( response ) {
        return( response.data );
    }
	
  }]);

tmwcapp.service('invoiceService', ['$http', '$q', 'AppConfig',
  function($http, $q, AppConfig){
  
    var serviceURL = AppConfig.serviceBaseURL + "invoice";

    return ({
        getInvoices: getInvoices,
        updateInvoice: updateInvoice,
        createInvoice: createInvoice,
        deleteInvoice: deleteInvoice
    });
    
    function getInvoices(rid) {
        var request = $http({
            method: "GET",
            url: serviceURL + '/rid/' + rid
        });
        return(request.then(handleSuccess, handleError));
    }

    function updateInvoice(invoice) {
        var request = $http({
            method: "PUT",
            url: serviceURL + '/' + invoice.id,
            data: invoice
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function createInvoice(invoice) {
        var request = $http({
            method: "POST",
            url: serviceURL,
            data: invoice
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function deleteInvoice(invoice) {
        var request = $http({
            method: "DELETE",
            url: serviceURL + '/' + invoice.id
        });
        return( request.then( handleSuccess, handleError ) );
    }

     function handleError( response ) {
        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (!angular.isObject( response.data ) || !response.data.message){
            return($q.reject("Hiba: " + response.status + " - " + response.statusText));
        }
        // Otherwise, use expected error message.
        return( $q.reject( response.data.message ) );
    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    function handleSuccess( response ) {
        return( response.data );
    }
    
  }]);

tmwcapp.service('fileService', ['$http', function ($http) {

    return {
        uploadFile : uploadFileToUrl
    }
    
    function uploadFileToUrl(file, uploadUrl){
        var fd = new FormData();
        fd.append('uploadFile', file);
        var request = $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        return request;
    }

}]);

tmwcapp.service('WSNotification', ['$websocket', '$rootScope', '$interval', 'AppConfig', function($websocket, $rootScope, $interval, AppConfig) {

    var ws = $websocket(AppConfig.notificationWSEndpoint);

    ws.onMessage(function(message) {
        notify('info', message.data);
    });

    ws.onOpen(function() {
        notify('info', 'Csatlakoztatva az értesítési végponthoz!');
        $interval(ping, 180000);
    });

    ws.onClose(function() {
       notify('info', 'Az értesítési végpont kapcsolat lezárult!'); 
       $interval.cancel();
    });

    ws.onError(function() {
        notify('danger', 'Hiba az értesítési végpont kommunikációban!');
        $interval.cancel();
    });

    function ping(){
        ws.send('ping');
    }

    function notify(type, msg){
        $rootScope.$broadcast('notificationEvent', {type : type, msg: msg });
    }

    $rootScope.$on('$destroy', function(){
      $interval.cancel();
    });

}]);

tmwcapp.service('authService', ['$http', '$q', 'AppConfig',
  function($http, $q, AppConfig){
  
    var serviceURL = AppConfig.serviceBaseURL + "auth";

    return ({
        login : login,
        logout : logout,
        status : status        
    });
    
    function login(userdata) {
        var request = $http({
            method: "POST",
            url: serviceURL + '/login/',
            data: userdata
        });
        return(request.then(handleSuccess, handleError));
    }

    function status() {
        var request = $http({
            method: "GET",
            url: serviceURL + '/status'
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function logout() {
        var request = $http({
            method: "GET",
            url: serviceURL + '/logout'
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