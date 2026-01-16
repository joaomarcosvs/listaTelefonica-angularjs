(function () {
    "use strict";

    angular.module("listaTelefonica", ["ngMessages"]);

    angular.module("listaTelefonica").controller("listaTelefonicaCtrl", function ($scope) {
        $scope.app = "Lista Telefônica";

        $scope.criterioDeOrdenacao = null;
        $scope.direcaoOrdenacao = false;

        $scope.operadoras = [
            { nome: "Oi", codigo: 14, categoria: "Celular", logo: "lib/images/oi.png", preco: 3 },
            { nome: "Vivo", codigo: 15, categoria: "Celular", logo: "lib/images/vivo.png", preco: 2 },
            { nome: "Tim", codigo: 41, categoria: "Celular", logo: "lib/images/tim.png", preco: 1 },
            { nome: "Claro", codigo: 21, categoria: "Celular", logo: "lib/images/claro.png", preco: 2 }
        ];

        $scope.contatos = [
            { nome: "Alanna", telefone: "5199864235", data: new Date(2025, 0, 12), operadora: $scope.operadoras[0] },
            { nome: "Joao M", telefone: "5199995555", data: new Date(2024, 10, 28), operadora: $scope.operadoras[3] },
            { nome: "Bia", telefone: "5199993333", data: new Date(2025, 5, 3), operadora: $scope.operadoras[1] },
            { nome: "Eduardo", telefone: "5199994444", data: new Date(2024, 7, 19), operadora: $scope.operadoras[2] },
            { nome: "Carla", telefone: "5199811111", data: new Date(2025, 2, 7), operadora: $scope.operadoras[0] },
            { nome: "Diego", telefone: "5199822222", data: new Date(2024, 11, 15), operadora: $scope.operadoras[1] },
            { nome: "Fernanda", telefone: "5199833333", data: new Date(2025, 3, 22), operadora: $scope.operadoras[2] },
            { nome: "Gabriel", telefone: "5199844444", data: new Date(2025, 6, 9), operadora: $scope.operadoras[3] },
            { nome: "Helena", telefone: "5199855555", data: new Date(2024, 9, 30), operadora: $scope.operadoras[1] },
            { nome: "Igor", telefone: "5199866666", data: new Date(2025, 4, 18), operadora: $scope.operadoras[0] },
            { nome: "Julia", telefone: "5199877777", data: new Date(2024, 6, 12), operadora: $scope.operadoras[2] },
            { nome: "Lucas", telefone: "5199888888", data: new Date(2025, 1, 25), operadora: $scope.operadoras[3] },
            { nome: "Marina", telefone: "5199899999", data: new Date(2024, 8, 5), operadora: $scope.operadoras[0] },
            { nome: "Nicolas", telefone: "5199800000", data: new Date(2025, 7, 14), operadora: $scope.operadoras[1] },
            { nome: "Olivia", telefone: "5199812121", data: new Date(2024, 4, 27), operadora: $scope.operadoras[2] }
        ];

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
