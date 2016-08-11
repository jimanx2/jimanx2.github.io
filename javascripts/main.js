$(function(){
	
	var app = angular.module("jimanx2", ['selectize', 'ngRoute','btford.socket-io', 'ngSanitize', 'btford.markdown']);
	
	app.filter('range', function(){
		return function(ele, range){
			return new Array(range);
		};
	})
	
	app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
			when('/start', {
        templateUrl: 'partials/general.html',
        controller: 'BlogCtrl'
      }).
      when('/rubyonrails', {
        templateUrl: 'partials/general.html',
        controller: 'BlogCtrl'
      }).
			when('/nodejs', {
        templateUrl: 'partials/general.html',
        controller: 'BlogCtrl'
      }).
      otherwise({
        redirectTo: '/start'
      });
  }]);
	
	app.factory('$socketIo', function (socketFactory) {
		var myIoSocket = io.connect('http://push.ezfr.d0t.co');

		mySocket = socketFactory({
			ioSocket: myIoSocket
		});
		mySocket.forward('connected');

		return mySocket;
	});
	
	app.controller("ContentCtrl", ['$rootScope', '$location', '$scope', '$socketIo',
	function($rootScope, $location, $scope, $socketIo){
		
		$rootScope.defaultSection = {id: 1, href: 'start', title: "General"}
		$rootScope.sectionHref = $rootScope.defaultSection.href;
		$rootScope.sectionTitle = $rootScope.defaultSection.title;
		$rootScope.sectionOptions = [ $rootScope.defaultSection ];
		
		$scope.$on('socket:connected', function(){
			$socketIo.emit('get-list');
		});
		
		$socketIo.on('list', function( data ){
			$rootScope.sectionOptions = [$rootScope.defaultSection].concat(data.sectionOptions);
			locChg();
		});
		
		var locChg = function(){
			$rootScope.section = $rootScope.sectionOptions.find(function(section){
				return section.href == $location.path().substring(1);
			});
			if( $rootScope.section ){
				$rootScope.sectionHref = $rootScope.section.href;
				$rootScope.sectionTitle = $rootScope.section.title;
			}
		};
		
		$rootScope.$on('$locationChangeSuccess', locChg);
		
		$rootScope.sectionConfig = {
			valueField: 'href',
			labelField: 'title',
			sortField: 'id',
			maxItems: 1,
			onChange: function(value){
				window.location.href = '#/'+value;
			}
		};
		$socketIo.forward('blog-list');
		
	}]);
	
	app.controller("BlogCtrl", ['$rootScope', '$scope', '$sce', '$socketIo', '$timeout',
	function($root, $scope, $sce, $socketIo, $timeout){
		var emitGet;
		$scope.blogList = [];
		$scope.blogListPage = 1;
		$scope.blogListLen = 5;
		
		$timeout(emitGet = function(){
			$socketIo.emit('get-blog-list', {
				cat: $root.section.href,
				offset: ($scope.blogListPage-1)*$scope.blogListLen,
				length: $scope.blogListLen
			});
		}, 200);
			
		
		$scope.$on('socket:blog-list', function($e, data){
			$scope.blogList = data.map(function(url){
				return {
					file: url,
					url: $sce.trustAsResourceUrl('http://push.ezfr.d0t.co/blog/'+url)
				}
			});
			$scope.blogListPage += 1;
		})
	}]);
	
});