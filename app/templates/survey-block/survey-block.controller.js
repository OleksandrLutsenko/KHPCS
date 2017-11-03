;(function () {
    'use strict';
    angular.module('app')
        .controller('SurveyBlockController', SurveyBlockController);

    SurveyBlockController.$inject = ['userService', '$state', 'survey'];

    function SurveyBlockController(userService, $state, survey) {
        let vm = this;
        vm.setActiveBlock = setActiveBlock;

        let id = survey.getActineSurvey();

        vm.items = userService.getItems()[id.indexSurvey].blocks;

        function setActiveBlock(id, indexBlock) {
            survey.setActiveBlock(id, indexBlock);
        }
    }
})();