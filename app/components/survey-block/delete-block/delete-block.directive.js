;(function () {
    'use strict';
    angular.module('app')
        .directive('deleteBlock', function() {
            return {
                restrict: 'E', // Е -елемент А- атрибут
                templateUrl: 'components/survey-block/delete-block/delete-block.html',
            };
        });
})();