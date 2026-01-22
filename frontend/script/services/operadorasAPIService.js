angular.module("listaTelefonica").service("operadorasAPI", function ($http, config){

    this.getOperadoras = function() {
        return $http.get(config.backendBaseUrl + "/api/operators");
    };

    var toLogoUrl = function (operator) {
        if (!operator || !operator.logoUrl) {
          return null;
        }

        if (operator.logoUrl.indexOf("http") === 0) {
          return operator.logoUrl;
        }

        return config.backendBaseUrl + operator.logoUrl;
      };

      return {
        getOperadoras: this.getOperadoras,
        toLogoUrl: toLogoUrl,
        backendBaseUrl: config.backendBaseUrl,
    };
});