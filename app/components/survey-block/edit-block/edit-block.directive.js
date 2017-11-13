;(function () {
    'use strict';
    angular.module('app')
        .directive('editBlock', function() {
            return {
                restrict: 'E', // Е -елемент А- атрибут
                templateUrl: 'components/survey-block/edit-block/edit-block.html',
            };
        });
})();