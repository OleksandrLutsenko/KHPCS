;(function () {
    'use strict';
    angular.module('app')
        .controller('SurveyQuestionController', SurveyQuestionController);

    SurveyQuestionController.$inject = ['userService', '$state', 'survey'];

    function SurveyQuestionController(userService, $state, survey) {
        let vm = this;
        let idS = survey.getActineSurvey();
        let idB = survey.getActiveBlock();

        vm.items = userService.getItems()[idS.indexSurvey].blocks[idB.indexBlock].questions;
        console.log(vm.items);

        function asdf(id, indexBlock) {
            survey.setActiveBlock(id, indexBlock)
        }
    }
})();