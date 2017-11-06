;(function () {
    'use strict';
    angular.module('app')
        .directive('dottEditMenu', function() {
            return {
                restrict: 'E', // Е -деректива елементом А- атрибутом
                templateUrl: 'components/survey-management/dott-menu/dott-edit-menu.html',
            };
        });
})();