'use strict';

tmwcapp.directive('appVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}]);

tmwcapp.directive("loader", function ($rootScope) {
    return function ($scope, element, attrs) {
        $scope.$on("loader_show", function () {
            return element.show();
        });
        return $scope.$on("loader_hide", function () {
            return element.hide();
        });
    };
});

tmwcapp.directive('showonhover', function(){
	return {
		link: function(scope, element, attrs){
			element.parent().bind('mouseenter', function(){
				element.show();
			});
			element.parent().bind('mouseleave', function(){
				element.hide();
			});
		}
	}
});

tmwcapp.directive('racenum', function($q, entryService) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$asyncValidators.racenum = function(modelValue, viewValue) {
        var inverse = attrs.racenum;
        if (ctrl.$isEmpty(modelValue) || (scope.mode !== 'CREATE' && !inverse)) {
          return $q.when();
        }
        var def = $q.defer();
        entryService.getEntry(scope.selectedRace.id, viewValue).then(
            function(entry){
                if(entry){
                    if(inverse){def.resolve();} else {def.reject();}
                }
                else{
                    if(inverse){def.reject();} else {def.resolve()};
                }
            },
            function(error){
                def.reject();
            }
        );
        return def.promise;
      };
    }
  };
});

tmwcapp.directive('licencenum', function($q, licenceService) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$asyncValidators.licencenum = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return $q.when();
        }
        var def = $q.defer();
        licenceService.licenceExists(viewValue).then(
            function(){
                def.resolve();
            },
            function(error){
                def.reject();
            }
        );
        return def.promise;
      };
    }
  };
});

tmwcapp.directive('fileUpload', ['fileService', function (fileService) {
    return {
        restrict : 'E',
        scope : {
            url : '=',
            onsuccess : '&',
            onerror : '&',
            onfilechange : '&'
        },
        link: function(scope, element, attrs) {
            var inputElement = element.find('#file');
            inputElement.bind('change', function(){
                scope.$apply(function(){
                    var file = inputElement[0].files[0];
                    scope.file = file;
                    scope.onfilechange()(file);
                });
            });
            element.find('#fileForm').bind('reset', function(){
                scope.$apply(function(){
                    scope.file = null;
                });
            });
        },
        controller : function($scope){
            $scope.uploadFile = function(){
                fileService.uploadFile($scope.file, $scope.url).then(
                    function(response){
                        $scope.onsuccess()(response);
                    },
                    function(error){
                        $scope.onerror()(response);
                    });
            }
        },
        template :  '<div class="row">' +
                        '<form role="form" id="fileForm" class="form-inline" novalidate>' +
                            '<label style="margin-bottom:15px;margin-left:15px">Fájl kiválasztása: </label>' +
                            '<span class="btn btn-default btn-file">Tallóz...<input type="file" id="file" class="form-control" /></span>' +
                            '<input type="text" ng-model="file.name" ng-disabled="true" size=50 class="form-control" style="margin-bottom:15px;margin-right:15px" />' + 
                            '<button type="button" class="btn btn-primary" ng-disabled="!file" ng-click="uploadFile()"><span class="glyphicon glyphicon-upload"></span> Feltölt</button>' +
                            '<button type="reset" class="btn btn-primary" ><span class="glyphicon glyphicon-remove-circle"></span> Töröl</button>' +
                        '</form>' + 
                    '</div>'
    };
}]);

tmwcapp.directive('orderable', function ($compile) {
    return {
        restrict : 'A',
        scope : {
            orderable : '='
        },
        link: function(scope, element, attrs) {
            var orderOptions = scope.orderable;
            var columns = element.children();
            for (var i = 0; i < orderOptions.orderProperties.length; i++) {
                var p = orderOptions.orderProperties[i];
                var c = $(columns[p.idx]);
                var aElement = angular.element("<span ng-click=\"orderable.orderProperty = \'" + p.name + "\'; orderable.orderReverse = !orderable.orderReverse;\" class=\"clickable\">" + c.html() + " </span>");
                var ascElement = angular.element("<span ng-show=\"orderable.orderProperty === \'" + p.name + "\' && !orderable.orderReverse\" class=\"glyphicon glyphicon-sort-by-alphabet\"></span>");
                var descElement = angular.element("<span ng-show=\"orderable.orderProperty === \'" + p.name + "\' && orderable.orderReverse\" class=\"glyphicon glyphicon-sort-by-alphabet-alt\"></span>");
                aElement.append($compile(ascElement)(scope), $compile(descElement)(scope));
                c.html($compile(aElement)(scope));
            };
        }
    };
});

tmwcapp.directive('searchField', function () {
    return {
        restrict : 'E',
        scope : {
            searchexpr : '=',
            searchfunc : '&'            
        },
        template :  '<form role="search">' +
                        '<div class="input-group">' +
                            '<div class="input-group-btn">' +
                                '<button class="btn btn-default" type="submit" ng-click="searchfunc()(searchexpr)"><i class="glyphicon glyphicon-search"></i></button>' +
                            '</div>' +
                            '<input type="text" name="searchfield" class="form-control" placeholder="Írd be a keresendő kifejezést..." ng-model="searchexpr">' +                            
                        '</div>' +
                    '</form>'
    };
});
