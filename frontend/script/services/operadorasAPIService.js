angular.module("listaTelefonica").service("operadorasAPI", function ($http){
    var backendBaseUrl = "http://localhost:8080";

    this.getOperadoras = function() {
        return $http.get(backendBaseUrl + "/api/operators");
    };
});