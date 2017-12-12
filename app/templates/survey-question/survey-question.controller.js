;(function () {
    'use strict';
    angular
        .module('app')
        .controller('SurveyQuestionController', SurveyQuestionController);

    SurveyQuestionController.$inject = ['userService', 'survey', '$scope', '$mdDialog', 'questionService' , 'toastr'];

    function SurveyQuestionController(userService, survey, $scope, $mdDialog, questionService , toastr) {
        let vm = this;

        let idS = survey.getActineSurvey();
        let idB = survey.getActiveBlock();
        let indexSurvey = idS.indexSurvey;
        let indexBlock = idB.indexBlock;
        let idBlock = idB.id;

        let dropDown = [];

        vm.items = userService.getItems()[indexSurvey].blocks[indexBlock].questions;
        console.log(vm.items);

        dropDownFill();

        function dropDownFill() {
            dropDown = [];
            vm.items.forEach(function (item) {
                if(item.hidden == 1){
                    dropDown.push(item.identifier)
                }
            });
        }

        vm.showEdit = showEdit;
        vm.deleteQuest = deleteQuest;

        $scope.$on('parent', function (event, data) {
            indexBlock = data;
            vm.items = userService.getItems()[indexSurvey].blocks[indexBlock].questions;
            idB = survey.getActiveBlock();
            idBlock = idB.id;
        });

        function deleteQuest(id, index) {
            $mdDialog.show({
                controller: 'DeleteViewController',
                controllerAs: 'vm',
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            }).then(function () {
                questionService.deleteQuestion(id).then(function (res) {
                    console.log(res);
                    if (res.success) {
                        vm.items.splice(index, 1);
                        dropDownFill();
                        toastr.success('Question was deleted');
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
                        items: vm.items,
                        dropDown: dropDown
                    }
                },
                templateUrl: 'components/survey-question/addQuest/addQuest.html',
                clickOutsideToClose: true,
            }).then(function () {
                console.log('then');
                userService.loadItems().then(function () {
                    vm.items = userService.getItems()[indexSurvey].blocks[indexBlock].questions;
                    dropDownFill();
                })
            })
        }
    }
})();