angular.module("listaTelefonica").config(function($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl: "script/view/home.html",
			controller: "listaTelefonicaCtrl"
		});
});