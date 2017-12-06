;(function () {
    'use strict';
    angular
        .module('app')
        .controller('SurveyQuestionController', SurveyQuestionController);

    SurveyQuestionController.$inject = ['userService', 'survey', '$scope', '$mdDialog'];

    function SurveyQuestionController(userService, survey, $scope, $mdDialog) {
        let vm = this;

        let idS = survey.getActineSurvey();
        let idB = survey.getActiveBlock();
        let indexBlock = idB.indexBlock;
        let idBlock = idB.id;

        vm.showEdit = showEdit;
        vm.deleteQuest = deleteQuest;

        $scope.$on('parent', function (event, data) {
            indexBlock = data;
            vm.items = userService.getItems()[idS.indexSurvey].blocks[indexBlock].questions;
            idB = survey.getActiveBlock();
            idBlock = idB.id;
        });

        vm.items = userService.getItems()[idS.indexSurvey].blocks[indexBlock].questions;

        function deleteQuest(id, index) {
            $mdDialog.show({
                controller: 'DeleteViewController',
                controllerAs: 'vm',
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            }).then(function () {
                deleteQuestion.deleteQuestion(id).then(function (res) {
                    console.log(res);
                    if (res.success) {
                        vm.items.splice(index, 1)
                    }
                    else {
                        console.log('error');
                    }
                })
            })
        }

        function showEdit(id, index) {
            $mdDialog.show({
                controller: 'AddQuestionController',
                controllerAs: 'vm',
                locals: {
                    data: {
                        idQuestion: id,
                        idBlock: idBlock,
                        indexQuestion: index,
                        items: vm.items
                    }
                },
                templateUrl: 'components/survey-question/addQuest/addQuest.html',
                clickOutsideToClose: true,
            })
        }
    }
})();