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

        if(vm.items.length > 0) {
            console.log('item not undefine', vm.items);
            survey.setActiveBlock(vm.items[0].id, 0);
            $state.go('tab.survey-block.survey-question');
        }
        else {
            console.log('no data')
        }





    }
})();