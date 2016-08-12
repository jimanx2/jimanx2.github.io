$(function(){
	
	var app = angular.module("jimanx2", ['selectize', 'ngRoute','btford.socket-io', 'ngSanitize', 'btford.markdown']);
	
	app.filter('range', function(){
		return function(ele, range){
			return new Array(range);
		};
	})
	
	app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/:cat', {
        templateUrl: 'partials/blog-list.html',
        controller: 'BlogListCtrl'
      })
			.when('/:cat/:file', {
        templateUrl: 'partials/blog.html',
        controller: 'BlogCtrl'
      })
      .otherwise({
        redirectTo: '/nodejs'
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
		
		$rootScope.sectionHref = null;
		$rootScope.sectionTitle = null;
		$rootScope.sectionOptions = [];
		
		$scope.$on('socket:connected', function(){
			$socketIo.emit('get-list');
		});
		
		$socketIo.on('list', function( data ){
			$rootScope.sectionOptions = data.sectionOptions;
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
	
	app.controller("BlogListCtrl", ['$rootScope', '$scope', '$sce', '$socketIo', '$timeout',
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
					url: '#/'+url,
					summaryUrl: $sce.trustAsResourceUrl(
						'http://push.ezfr.d0t.co/blog/' + url.replace(/\.md/,'').concat(".summary")
					)
				}
			});
			$scope.blogListPage += 1;
		});
		
		$scope.getSummaryUrl = function( url ){
			
		}
	}]);
		
	app.controller("BlogCtrl", ['$rootScope', '$scope', '$sce', '$socketIo', '$timeout', '$routeParams',
	function($root, $scope, $sce, $socketIo, $timeout, $routeParams){
		$scope.blog = {
			url: $sce.trustAsResourceUrl('http://push.ezfr.d0t.co/blog/'+$routeParams.cat+'/'+$routeParams.file)
		}
	}]);
	
});