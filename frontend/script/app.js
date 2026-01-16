(function () {
    "use strict";

    angular.module("listaTelefonica", ["ngMessages"]);

    angular.module("listaTelefonica").controller("listaTelefonicaCtrl", function ($scope) {
        $scope.app = "Lista Telefônica";

        $scope.operadoras = [
            { nome: "Oi", codigo: 14, categoria: "Celular", logo: "lib/images/oi.png" },
            { nome: "Vivo", codigo: 15, categoria: "Celular", logo: "lib/images/vivo.png" },
            { nome: "Tim", codigo: 41, categoria: "Celular", logo: "lib/images/tim.png" },
            { nome: "Claro", codigo: 21, categoria: "Celular", logo: "lib/images/claro.png" }
        ];

        $scope.contatos = [
            { nome: "Alanna", telefone: "5199864235", data: new Date(), operadora: $scope.operadoras[0] },
            { nome: "Joao M", telefone: "5199995555", data: new Date(), operadora: $scope.operadoras[3] },
            { nome: "Bia", telefone: "5199993333", data: new Date(), operadora: $scope.operadoras[1] },
            { nome: "Eduardo", telefone: "5199994444", data: new Date(), operadora: $scope.operadoras[2] }
        ];

        $scope.adicionarContato = function (contato) {
            $scope.contatos.push(angular.copy(contato));
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
