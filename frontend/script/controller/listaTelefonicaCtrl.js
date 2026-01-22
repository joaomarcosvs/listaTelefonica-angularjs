(function () {
  "use strict";

  angular
    .module("listaTelefonica")
    .controller("listaTelefonicaCtrl", function ($scope, $q, contatosAPI, operadorasAPI) {
      $scope.app = "Lista Telefônica";

      $scope.criterioDeOrdenacao = null;
      $scope.direcaoOrdenacao = false;

      $scope.operadoras = [];
      $scope.contatos = [];

      var toLogoUrl = function (operator) {
        if (!operator || !operator.logoUrl) {
          return null;
        }

        if (operator.logoUrl.indexOf("http") === 0) {
          return operator.logoUrl;
        }

        return contatosAPI.backendBaseUrl + operator.logoUrl;
      };

      var carregaContatos = function () {
        contatosAPI.getContatos().then(function (response) {
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
        operadorasAPI.getOperadoras().then(function (response) {
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
          contatosAPI
            .updateContato(contato.id, payload)
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

        contatosAPI
          .createContato(payload)
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
          return contatosAPI.deleteContato(contato.id);
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
})();
