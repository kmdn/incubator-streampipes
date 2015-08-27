var spMy = angular.module('spMy', ['ngMaterial','ngMdIcons'])
.controller('MyElementsCtrl', function($rootScope, $scope, $timeout, $log, $location, $http, restApi, $mdToast, $animate, $mdDialog) {
	
	$scope.currentElements = {};
	
	 $scope.tabs = [
		            {
		                  title : 'Actions',
		                  type: 'action'
		            },
		            {
		                  title : 'Sepas',
		                  type: 'sepa'
		            },
		            {
		                  title : 'Sources',
		                  type: 'source'
		                },
		            ];

	$scope.loadCurrentElements = function(type) {
		if (type == 'source')  { $scope.loadOwnSources();  }
		else if (type == 'sepa') { $scope.loadOwnSepas();  }
		else if (type == 'action') { $scope.loadOwnActions(); }
	}
	
    $scope.loadOwnActions = function () {
        restApi.getOwnActions()
            .success(function (actions) {
            	$scope.currentElements = actions;
            })
            .error(function (error) {
                $scope.status = 'Unable to load actions: ' + error.message;
            });
    }
    
    $scope.loadOwnSepas = function () {
        restApi.getOwnSepas()
            .success(function (sepas) {
            	$scope.currentElements = sepas;
            })
            .error(function (error) {
                $scope.status = 'Unable to load sepas: ' + error.message;
            });
    }
    
    $scope.loadOwnSources = function () {
        restApi.getOwnSources()
            .success(function (sources) {
            	$scope.currentElements = sources;
            })
            .error(function (error) {
                $scope.status = 'Unable to load sepas: ' + error.message;
            });
    }
        
    $scope.elementTextIcon = function (string){
        var result ="";
        if (string.length <= 4){
            result = string;
        }else {
            var words = string.split(" ");
            words.forEach(function(word, i){
                result += word.charAt(0);
            });
        }
        return result.toUpperCase();
    }
    
   $scope.toggleFavorite = function(element, type) {
	   if (type == 'action') $scope.toggleFavoriteAction(element, type);
	   else if (type == 'source') $scope.toggleFavoriteSource(element, type);
	   else if (type == 'sepa') $scope.toggleFavoriteSepa(element, type);
   } 
   
   $scope.refresh = function(elementUri, type) {
	  restApi.update(elementUri).success(function (msg) {
		  $scope.showToast(msg.notifications[0].title);
	  }).then(function() {
		  $scope.loadCurrentElements(type);
	  })
   } 
   
   $scope.remove = function(elementUri, type) {
		  restApi.del(elementUri).success(function (msg) {
			  $scope.showToast(msg.notifications[0].title);
		  }).then(function() {
			  $scope.loadCurrentElements(type);
		  })
	   } 
   
   $scope.jsonld = function(event, elementUri) {
	   restApi.jsonld(elementUri).success(function (msg) {
			  $scope.showAlert(event, elementUri, msg);
		  })
   }
    
   $scope.toggleFavoriteAction = function (action, type) {
	   if (action.favorite) {
		   restApi.removePreferredAction(action.elementId).success(function (msg) {
			$scope.showToast(msg.notifications[0].title);   
		   }).error(function(error) {
			   $scope.showToast(error.data.name);  
		   }).then(function() {
			   $scope.loadCurrentElements(type);  
		   })
	   }
	   else {
		   restApi.addPreferredAction(action.elementId).success(function (msg) {
			   $scope.showToast(msg.notifications[0].title);     
		   }).error(function(error) {
			   $scope.showToast(error.notifications[0].title);   
		   }).then(function() {
			   $scope.loadCurrentElements(type);
		   })
	   }
   }
   
   $scope.toggleFavoriteSepa = function (sepa, type) {
	   if (sepa.favorite) {
		   restApi.removePreferredSepa(sepa.elementId).success(function (msg) {
			$scope.showToast(msg.notifications[0].title);   
		   }).error(function(error) {
			   $scope.showToast(error.notifications[0].title);   
		   }).then(function() {
			   $scope.loadCurrentElements(type);
		   })
	   }
	   else {
		   restApi.addPreferredSepa(sepa.elementId).success(function (msg) {
			   $scope.showToast(msg.notifications[0].title);     
		   }).error(function(error) {
			   $scope.showToast(error.notifications[0].title);   
		   }).then(function() {
			   $scope.loadCurrentElements(type);
		   })
	   }
   }
   
   $scope.toggleFavoriteSource = function (source, type) {
	   if (source.favorite) {
		   restApi.removePreferredSource(source.elementId).success(function (msg) {
			$scope.showToast(msg.notifications[0].title);   
		   }).error(function(error) {
			   $scope.showToast(error.notifications[0].title);   
		   }).then(function() {
			   $scope.loadCurrentElements(type); 
		   })
	   }
	   else {
		   restApi.addPreferredSource(source.elementId).success(function (msg) {
			   $scope.showToast(msg.notifications[0].title);     
		   }).error(function(error) {
			   $scope.showToast(error.notifications[0].title);   
		   }).then(function() {
			   $scope.loadCurrentElements(type); 
		   })
	   }
   }
   
   $scope.showToast = function(string) {
	    $mdToast.show(
	      $mdToast.simple()
	        .content(string)
	        .position("right")
	        .hideDelay(3000)
	    );
   };	
   
   $scope.showAlert = function(ev, title, content) {

	    $mdDialog.show(
	      $mdDialog.alert()
	        .parent(angular.element(document.querySelector('#topDiv')))
	        .clickOutsideToClose(true)
	        .title(title)
	        .content(angular.toJson(content, true))
	        .ariaLabel('JSON-LD')
	        .ok('Done')
	        .targetEvent(ev)
	    );
   };
   
});