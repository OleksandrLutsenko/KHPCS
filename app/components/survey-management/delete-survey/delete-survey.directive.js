;(function () {
    'use strict';
    angular.module('app')
        .directive('deleteSurvey', function() {
            return {
                restrict: 'E', // Е -елемент А- атрибут
                templateUrl: 'components/survey-management/delete-survey/delete-survey.html',
            };
        });
})();