;(function () {
    'use strict';
    angular.module('app')
        .directive('questList', function() {
            return {
                restrict: 'EA', // Е -деректива елементом А- атрибутом
                templateUrl: 'components/survey-management/questionnaire-list/questionnaire-list.html'
            };
        });
})();