(function () {
    "use strict";

    angular.module("listaTelefonica", ["ngMessages"]);

    angular.module("listaTelefonica").controller("listaTelefonicaCtrl", function ($scope, $http) {
        $scope.app = "Lista Telefônica";

        $scope.criterioDeOrdenacao = null;
        $scope.direcaoOrdenacao = false;

        $scope.operadoras = [];
        $scope.contatos = [];

        var bytesToBase64 = function (bytes) {
            var binary = "";
            var chunkSize = 0x8000;
            for (var i = 0; i < bytes.length; i += chunkSize) {
                var chunk = bytes.slice(i, i + chunkSize);
                binary += String.fromCharCode.apply(null, chunk);
            }
            return btoa(binary);
        };

        var toLogoUrl = function (operator) {
            if (!operator || !operator.logo || operator.logo.length === 0) {
                return null;
            }

            if (Array.isArray(operator.logo)) {
                return "data:image/png;base64," + bytesToBase64(operator.logo);
            }

            if (operator.logo.indexOf("data:image") === 0) {
                return operator.logo;
            }

            return "data:image/png;base64," + operator.logo;
        };

        var carregaContatos = function () {
            $http.get("http://localhost:8080/api/contacts").then(function (response) {
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
            $http.get("http://localhost:8080/api/operators").then(function (response) {
                $scope.operadoras = response.data.map(function (operadora) {
                    operadora.logoUrl = toLogoUrl(operadora);
                    return operadora;
                });
            });
        };

        $scope.adicionarContato = function (contato) {
            var novoContato = angular.copy(contato);
            novoContato.data = new Date();
            $scope.contatos.push(novoContato);
            delete $scope.contato;
            $scope.contatoForm.$setPristine();
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
