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

tmwcapp.service('notificationService', ['$rootScope',
  function($rootScope){

    return {
        notify : notify
    }

    function notify(type, msg){
        $rootScope.$broadcast('notificationEvent', { type: type, msg: msg });
    }

  }
]);

tmwcapp.service('responseHandler', ['$q', '$http',
  function($q, $http){

    return {
        handle : handle
    }

    function handle(requestObject){
        var request = $http(requestObject);
        return(request.then(handleSuccess, handleError));
    }

    function handleError(response) {
        if(!angular.isObject(response.data) || !response.data.msg){
            return($q.reject({type : "error", msg : "Hiba: " + response.status + " - " + response.statusText}));
        }
        return($q.reject(response.data));
    }
    
    function handleSuccess( response ) {
        return(response.data);
    }

  }
]);

tmwcapp.service('parameterService', ['$http', '$q', 'AppConfig', 'responseHandler',
  function($http, $q, AppConfig, responseHandler){
  
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
        var request = {
            method: "GET",
            url: serviceBaseURL + type
        };
        return responseHandler.handle(request);
    }

    function updateParameter(type, parameter) {
        var request = {
            method: "PUT",
            url: serviceBaseURL + type + '/' + parameter.id,
            data: parameter
        };
        return responseHandler.handle(request);
    }

    function createParameter(type, parameter) {
        var request = {
            method: "POST",
            url: serviceBaseURL + type,
            data: parameter
        };
        return responseHandler.handle(request);
    }
    
    function deleteParameter(type, parameter) {
        var request = {
            method: "DELETE",
            url: serviceBaseURL + type + '/' + parameter.id
        };
        return responseHandler.handle(request);
    }

    function incrementAgegroupYears() {
        var request = {
            method: "PUT",
            url: serviceBaseURL + 'agegroup/incrementyears',
        };
        return responseHandler.handle(request);
    }

    function decrementAgegroupYears() {
        var request = {
            method: "PUT",
            url: serviceBaseURL + 'agegroup/decrementyears',
        };
        return responseHandler.handle(request);
    }
	
  }]);

tmwcapp.service('invoiceService', ['$http', '$q', 'AppConfig', 'responseHandler',
  function($http, $q, AppConfig, responseHandler){
  
    var serviceURL = AppConfig.serviceBaseURL + "invoice";

    return ({
        getInvoices: getInvoices,
        updateInvoice: updateInvoice,
        createInvoice: createInvoice,
        deleteInvoice: deleteInvoice
    });
    
    function getInvoices(rid) {
        var request = {
            method: "GET",
            url: serviceURL + '/rid/' + rid
        };
        return responseHandler.handle(request);
    }

    function updateInvoice(invoice) {
        var request = {
            method: "PUT",
            url: serviceURL + '/' + invoice.id,
            data: invoice
        };
        return responseHandler.handle(request);
    }

    function createInvoice(invoice) {
        var request = {
            method: "POST",
            url: serviceURL,
            data: invoice
        };
        return responseHandler.handle(request);
    }
    
    function deleteInvoice(invoice) {
        var request = {
            method: "DELETE",
            url: serviceURL + '/' + invoice.id
        };
        return responseHandler.handle(request);
    }
    
  }]);

tmwcapp.service('fileService', ['$http', '$window', 'AppConfig', function ($http, $window, AppConfig) {

    var endpoint = AppConfig.serviceBaseURL + 'entry/getdocument/'

    return {
        uploadFile : uploadFileToUrl,
        downloadFile : downloadFile
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

    function downloadFile(filename){
        $window.open(endpoint + filename);
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
    });

    ws.onError(function() {
        notify('danger', 'Hiba az értesítési végpont kommunikációban!');
        $interval.cancel();
    });

    function ping(){
        if(ws.readyState == 1){
            ws.send('ping');    
        }
        else if(ws.readyState == 3){
            $interval.cancel();
        }        
    }

    function notify(type, msg){
        $rootScope.$broadcast('notificationEvent', {type : type, msg: msg });
    }

    $rootScope.$on('$destroy', function(){
        ws.close(true);
        $interval.cancel();
    });

}]);

tmwcapp.service('authService', ['$http', '$q', 'AppConfig', 'responseHandler',
  function($http, $q, AppConfig, responseHandler){
  
    var serviceURL = AppConfig.serviceBaseURL + "auth";

    return ({
        login : login,
        logout : logout,
        status : status        
    });
    
    function login(userdata) {
        var request = {
            method: "POST",
            url: serviceURL + '/login/',
            data: userdata
        };
        return responseHandler.handle(request);
    }

    function status() {
        var request = {
            method: "GET",
            url: serviceURL + '/status'
        };
        return responseHandler.handle(request);
    }

    function logout() {
        var request = {
            method: "GET",
            url: serviceURL + '/logout'
        };
        return responseHandler.handle(request);
    }
    
  }]);

tmwcapp.service('resultmodService', ['$http', '$q', 'AppConfig', 'responseHandler',
  function($http, $q, AppConfig, responseHandler){
  
    var serviceURL = AppConfig.serviceBaseURL + "resultmod";

    return ({
        getResultmods: getResultmods,
        updateResultmod: updateResultmod,
        createResultmod: createResultmod,
        deleteResultmod: deleteResultmod
    });
    
    function getResultmods() {
        var request = {
            method: "GET",
            url: serviceURL
        };
        return responseHandler.handle(request);
    }

    function updateResultmod(resultmod) {
        var request = {
            method: "PUT",
            url: serviceURL + '/admin/' + resultmod.id,
            data: resultmod
        };
        return responseHandler.handle(request);
    }

    function createResultmod(resultmod) {
        var request = {
            method: "POST",
            url: serviceURL + '/admin',
            data: resultmod
        };
        return responseHandler.handle(request);
    }
    
    function deleteResultmod(resultmod) {
        var request = {
            method: "DELETE",
            url: serviceURL + '/admin/' + resultmod.id
        };
        return responseHandler.handle(request);
    }
    
  }]);