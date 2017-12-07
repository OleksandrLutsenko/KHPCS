;(function () {
    'use strict';
    angular.module('app')
        .directive('addUserVariability', function() {
            return {
                restrict: 'E', // Е -елемент А- атрибут
                templateUrl: 'components/contract-editor/add-user-variability/add-user-variability.html',
            };
        });
})();