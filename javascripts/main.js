$(function(){
	
	var app = angular.module("jimanx2", ['selectize', 'ngRoute']);
	
	app.filter('range', function(){
		return function(ele, range){
			return new Array(range);
		};
	})
	
	app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
			when('/start', {
        templateUrl: 'partials/cplusplus.html',
        controller: 'CppCtrl'
      }).
      when('/rubyrails', {
        templateUrl: 'partials/rubyrails.html',
        controller: 'RailsCtrl'
      }).
      otherwise({
        redirectTo: '/start'
      });
  }]);
	
	app.controller("ContentCtrl", ['$rootScope', '$location',
	function($rootScope, $location){
		
		$rootScope.$on('$locationChangeSuccess', function(){
			$rootScope.section = $rootScope.sectionOptions.filter(function(option){
				return option.href == $location.path().substring(1);
			})[0].href;
		});
		$rootScope.sectionOptions = [
			{id: 1, href: 'start', title: 'Where it all began (C++)'},
			{id: 2, href: 'rubyrails', title: 'Ruby on Rails'},
			{id: 3, href: 'perl', title: 'Perl'},
			{id: 4, href: 'python', title: 'Python'},
		];
		
		$rootScope.sectionConfig = {
			valueField: 'href',
			labelField: 'title',
			sortField: 'id',
			placeholder: 'Pick something',
			maxItems: 1,
			onChange: function(value){
				window.location.href = '#/'+value;
			}
		};
	}]);
	
	app.controller("RailsCtrl", ['$rootScope', '$scope', '$sce',
	function($rootScope, $scope, $sce){
		
		$rootScope.title = $sce.trustAsHtml('JimanX2 | Ruby on Rails');
	}]);
	
	app.controller("CppCtrl", ['$rootScope', '$scope', '$sce',
	function($rootScope, $scope, $sce){
		$rootScope.title = $sce.trustAsHtml('JimanX2 | Where it all began');
	}]);
})