angular.module("listaTelefonica").directive("uiDate", function () {
    function formatDate(value) {
        if (!value) {
            return value;
        }

        var digits = String(value).replace(/\D/g, "").slice(0, 8);
        var day = digits.slice(0, 2);
        var month = digits.slice(2, 4);
        var year = digits.slice(4, 8);
        var formatted = day;

        if (month) {
            formatted += "/" + month;
        }
        if (year) {
            formatted += "/" + year;
        }

        return formatted;
    }

    function isValidDateString(value) {
        if (!value) {
            return true;
        }

        var match = String(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!match) {
            return false;
        }

        var day = parseInt(match[1], 10);
        var month = parseInt(match[2], 10) - 1;
        var year = parseInt(match[3], 10);
        var date = new Date(year, month, day);

        return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
    }

    return {
        require: "ngModel",
        restrict: "A",
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (viewValue) {
                var formatted = formatDate(viewValue);
                if (formatted !== viewValue) {
                    ngModelCtrl.$setViewValue(formatted);
                    ngModelCtrl.$render();
                }

                return formatted;
            });

            ngModelCtrl.$formatters.push(function (modelValue) {
                return formatDate(modelValue);
            });

            ngModelCtrl.$validators.uiDate = function (modelValue, viewValue) {
                return isValidDateString(viewValue || modelValue);
            };
        }
    };
});