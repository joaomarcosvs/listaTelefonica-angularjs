angular.module("listaTelefonica").factory("contatosAPI", function ($http, config) {

    var _getContatos = function () {
        return $http.get(config.backendBaseUrl + "/api/contacts");
    };

    var _createContato = function (contato) {
        return $http.post(config.backendBaseUrl + "/api/contacts", contato);
    };

    var _updateContato = function (id, contato) {
        return $http.put(config.backendBaseUrl + "/api/contacts/" + id, contato);
    };

    var _deleteContato = function (id) {
        return $http.delete(config.backendBaseUrl + "/api/contacts/" + id);
    };

    return {
        getContatos: _getContatos,
        createContato: _createContato,
        updateContato: _updateContato,
        deleteContato: _deleteContato,
        backendBaseUrl: config.backendBaseUrl,
    };
});