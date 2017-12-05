;(function () {
    'use strict';
    angular.module('app')
        .directive('editUserVariability', function() {
            return {
                restrict: 'E', // Е -елемент А- атрибут
                templateUrl: 'components/contract-editor/edit-user-variability/edit-user-variability.html',
            };
        });
})();