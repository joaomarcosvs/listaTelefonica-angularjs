(function () {
  "use strict";

  angular.module("listaTelefonica", ["ngMessages"]);

  angular
    .module("listaTelefonica")
    .controller("listaTelefonicaCtrl", function ($scope, $http, $q) {
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

          if ($scope.contato && $scope.contato.operator) {
            var atual = $scope.operadoras.find(function (operadora) {
              return operadora.id === $scope.contato.operator.id;
            });
            if (atual) {
              $scope.contato.operator = atual;
            }
          }
        });
      };

      $scope.salvarContato = function (contato) {
        if (!contato) {
          return;
        }

        var payload = {
          name: contato.name,
          phoneNumber: contato.phoneNumber,
          email: contato.email,
          operatorId:
            contato.operator && contato.operator.id
              ? contato.operator.id
              : null,
        };

        if (contato.id) {
          $http
            .put(backendBaseUrl + "/api/contacts/" + contato.id, payload)
            .then(function (response) {
              var updated = response.data;
              if (updated.operator) {
                updated.operator.logoUrl = toLogoUrl(updated.operator);
              }

              var index = $scope.contatos.findIndex(function (item) {
                return item.id === updated.id;
              });

              if (index >= 0) {
                $scope.contatos[index] = updated;
              }

              delete $scope.contato;
              $scope.contatoForm.$setPristine();
            });
          return;
        }

        $http
          .post(backendBaseUrl + "/api/contacts", payload)
          .then(function (response) {
            var saved = response.data;
            if (saved.operator) {
              saved.operator.logoUrl = toLogoUrl(saved.operator);
            }
            $scope.contatos.push(saved);
            delete $scope.contato;
            $scope.contatoForm.$setPristine();
          });
      };

      $scope.editarContato = function (contato) {
        $scope.contato = angular.copy(contato);

        if ($scope.contato.operator && $scope.operadoras.length > 0) {
          var atual = $scope.operadoras.find(function (operadora) {
            return operadora.id === $scope.contato.operator.id;
          });
          if (atual) {
            $scope.contato.operator = atual;
          }
        }
      };

      $scope.apagarContatos = function (contatos) {
        var selecionados = contatos.filter(function (contato) {
          return contato.selecionado;
        });

        if (!selecionados.length) {
          return;
        }

        var requisicoes = selecionados.map(function (contato) {
          return $http.delete(backendBaseUrl + "/api/contacts/" + contato.id);
        });

        $q.all(requisicoes).then(function () {
          carregaContatos();
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
      };

      carregaContatos();
      carregaOperadoras();
    });

  angular.module("listaTelefonica").directive("telefoneMask", function () {
    return {
      restrict: "A",
      require: "ngModel",
      link: function (scope, element, attrs, ngModelCtrl) {
        function normalizeDigits(value) {
          if (!value) {
            return "";
          }

          var digits = value.toString().replace(/\D/g, "");

          if (digits.indexOf("55") === 0) {
            digits = digits.slice(2);
          }

          return digits.slice(0, 11);
        }

        function formatPhone(digits) {
          if (!digits) {
            return "";
          }

          if (digits.length <= 2) {
            return "+55 " + digits;
          }

          var ddd = digits.slice(0, 2);
          var local = digits.slice(2);

          if (local.length <= 4) {
            return "+55 " + ddd + " " + local;
          }

          var prefix = local.slice(0, local.length > 8 ? 5 : 4);
          var suffix = local.slice(local.length > 8 ? 5 : 4);

          return "+55 " + ddd + " " + prefix + "-" + suffix;
        }

        ngModelCtrl.$parsers.push(function (value) {
          if (!value) {
            return value;
          }

          var digits = normalizeDigits(value);
          var formatted = formatPhone(digits);

          if (formatted !== value) {
            ngModelCtrl.$setViewValue(formatted);
            ngModelCtrl.$render();
          }

          return digits;
        });

        ngModelCtrl.$formatters.push(function (value) {
          return formatPhone(normalizeDigits(value));
        });
      },
    };
  });
})();
