angular.module("listaTelefonica").directive("uiAlert", function() {
    return {
        templateUrl: "script/view/alert.html",
        replace: true,
        restrict: "E"
    };
});