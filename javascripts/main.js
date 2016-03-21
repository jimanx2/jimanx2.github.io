$(function(){
	
	var app = angular.module("jimanx2", ['selectize']);
	app.controller("ContentCtrl", function(){
		
		this.myModel = 1;
		this.myOptions = [
			{id: 1, title: 'Blog'},
			{id: 2, title: 'Ruby on Rails'},
			{id: 3, title: 'Perl'},
			{id: 4, title: 'Python'},
		];
		
		this.myConfig = {
			create: true,
			valueField: 'id',
			labelField: 'title',
			sortField: 'title',
			placeholder: 'Pick something',
			maxItems: 1
		};
	});
})