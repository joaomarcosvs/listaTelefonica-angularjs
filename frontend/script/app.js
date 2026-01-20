(function () {
  "use strict";

  angular.module("listaTelefonica", ["ngMessages"]);

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
