angular.module("listaTelefonica").directive("uiAlert", function () {
    return {
        restrict: "E",
        templateUrl: "script/view/alert.html",
        scope: {
            title: "@?",
            message: "=?",
            type: "@?",
            dismissible: "<?",
            onClose: "&?"
        },
        controllerAs: "alert",
        bindToController: true,
        controller: function () {
            var vm = this;

            vm.$onInit = function () {
                vm.type = vm.type || "error";
                vm.title = vm.title || "Ops, aconteceu um erro!";
                vm.dismissible = vm.dismissible !== false;
            };

            vm.close = function () {
                if (typeof vm.onClose === "function") {
                    vm.onClose();
                }

                if (typeof vm.message !== "undefined") {
                    vm.message = null;
                }
            };
        }
    };
});