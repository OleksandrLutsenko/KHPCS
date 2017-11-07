;(function () {
    'use strict';
    angular.module('app')
        .controller('SurveyBlockController', SurveyBlockController);

    SurveyBlockController.$inject = ['userService', '$state', 'survey', '$scope'];

    function SurveyBlockController(userService, $state, survey, $scope) {
        let vm = this;
        vm.setActiveBlock = setActiveBlock;
        let id = survey.getActineSurvey();

        vm.items = userService.getItems()[id.indexSurvey].blocks;

        function setActiveBlock(id, indexBlock) {
            survey.setActiveBlock(id, indexBlock);
            $scope.$broadcast('parent', indexBlock);
        }

        if(typeof items != 'undefined') {
            survey.setActiveBlock(vm.items[0].id, 0);
            $state.go('tab.survey-block.survey-question');
        }
        else {
            console.log('no data')
        }
        // survey.setActiveBlock(vm.items[0].id, 0);
        // $state.go('tab.survey-block.survey-question');
        //
        // function setActiveBlock(id, indexBlock) {
        //     survey.setActiveBlock(id, indexBlock);
        //     $scope.$broadcast('parent', indexBlock);
        // }
    }
})();