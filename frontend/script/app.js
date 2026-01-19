(function () {
    "use strict";

    angular.module("listaTelefonica", ["ngMessages"]);

    angular.module("listaTelefonica").controller("listaTelefonicaCtrl", function ($scope, $http) {
        $scope.app = "Lista Telefônica";

        $scope.criterioDeOrdenacao = null;
        $scope.direcaoOrdenacao = false;

        $scope.operadoras = [];
        $scope.contatos = [];

        var backendBaseUrl = "http://localhost:8080";

        var toLogoUrl = function (operator) {
            if (!operator || !operator.logoUrl) {
                return null;
            }

            if (operator.logoUrl.indexOf("http") === 0) {
                return operator.logoUrl;
            }

            return backendBaseUrl + operator.logoUrl;
        };

        var carregaContatos = function () {
            $http.get(backendBaseUrl + "/api/contacts").then(function (response) {
                $scope.contatos = response.data.map(function (contato) {
                    if (contato.operator) {
                        contato.operator.logoUrl = toLogoUrl(contato.operator);
                    }
                    contato.data = contato.data || null;
                    return contato;
                });
            });
        };

        var carregaOperadoras = function () {
            $http.get(backendBaseUrl + "/api/operators").then(function (response) {
                $scope.operadoras = response.data.map(function (operadora) {
                    operadora.logoUrl = toLogoUrl(operadora);
                    return operadora;
                });
            });
        };

        $scope.adicionarContato = function (contato) {
            var payload = {
                name: contato.name,
                phoneNumber: contato.phoneNumber,
                email: contato.email,
                operatorId: contato.operator && contato.operator.id ? contato.operator.id : null
            };

            $http.post(backendBaseUrl + "/api/contacts", payload).then(function (response) {
                var saved = response.data;
                if (saved.operator) {
                    saved.operator.logoUrl = toLogoUrl(saved.operator);
                }
                $scope.contatos.push(saved);
                delete $scope.contato;
                $scope.contatoForm.$setPristine();
            });
        };

        $scope.apagarContatos = function (contatos) {
            $scope.contatos = contatos.filter(function (contato) {
                return !contato.selecionado;
            });
        };

        $scope.isContatoSelecionado = function (contatos) {
            return contatos.some(function (contato) {
                return contato.selecionado;
            });
        };

        $scope.ordenarPor = function (campo) {
            $scope.criterioDeOrdenacao = campo;
            $scope.direcaoOrdenacao = !$scope.direcaoOrdenacao;
        }

        carregaContatos();
        carregaOperadoras();

    });

    angular.module("listaTelefonica").directive("telefoneMask", function () {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attrs, ngModelCtrl) {
                function formatPhone(digits) {
                    if (!digits) {
                        return "";
                    }

                    if (digits.length <= 2) {
                        return "(" + digits;
                    }

                    var ddd = digits.slice(0, 2);
                    var prefix = digits.slice(2, digits.length > 10 ? 7 : 6);
                    var suffix = digits.slice(digits.length > 10 ? 7 : 6);

                    if (digits.length <= 6) {
                        return "(" + ddd + ") " + prefix;
                    }

                    return "(" + ddd + ") " + prefix + "-" + suffix;
                }

                ngModelCtrl.$parsers.push(function (value) {
                    if (!value) {
                        return value;
                    }

                    var digits = value.replace(/\D/g, "").slice(0, 11);
                    var formatted = formatPhone(digits);

                    if (formatted !== value) {
                        ngModelCtrl.$setViewValue(formatted);
                        ngModelCtrl.$render();
                    }

                    return digits;
                });

                ngModelCtrl.$formatters.push(function (value) {
                    return formatPhone(value);
                });
            }
        };
    });
})();
