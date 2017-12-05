;(function () {
    // 'use strict';
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

        function cancel() {
            $mdDialog.cancel();
        }


        function deleteQuest(id) {
            $mdDialog.show({
                controller: deleteQuestController,
                controllerAs: 'vm',
                locals: {
                    data: {
                        id: id,
                    }
                },
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            })
        }

        function deleteQuestController(data) {
            let vmd = this;

            let id = data.id;

            vmd.cancel = function () {
                $mdDialog.cancel();
            };

            vmd.delete = function () {
                userService.deleteQuestion(id).then(function (res) {
                    if (res.success) {
                        userService.loadItems().then(function () {
                            vm.items = userService.getItems()[idS.indexSurvey].blocks[indexBlock].questions;
                        });
                        cancel();
                    }
                    else {
                        console.log('error');
                    }
                })

            };

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