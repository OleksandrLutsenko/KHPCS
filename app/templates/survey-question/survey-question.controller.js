;(function () {
    'use strict';
    angular
        .module('app')
        .controller('SurveyQuestionController', SurveyQuestionController);

    SurveyQuestionController.$inject = ['survey', '$scope', '$mdDialog', 'blockService', 'toastr', 'items', 'tabsService'];

    function SurveyQuestionController(survey, $scope, $mdDialog, blockService, toastr, items, tabsService) {
        let vm = this;
        tabsService.startTab();

        let activeBlock = survey.getActiveBlock();
        let indexBlock = activeBlock.indexBlock;
        let idBlock = activeBlock.id;

        vm.items = items[indexBlock].questions;

        vm.save = save;
        vm.showEdit = showEdit;
        vm.deleteQuest = deleteQuest;


        $scope.$on('setActiveBlock', function (event, data) {
            if(data.data != undefined){
                items.push(data.data)
            }

            activeBlock = data.activeBlock;
            indexBlock = activeBlock.indexBlock;
            idBlock = activeBlock.id;

            vm.items = items[indexBlock].questions;
        });
        $scope.$on('mowUpdate', function (event, data) {
            items = data;
            vm.items = items[indexBlock].questions;
        });

        vm.sortableOptionsQuestion = {
            connectWith: ".question-container",
            'ui-floating': true,

            update: function (event, ui) {
                let droptargetModel = ui.item.sortable.droptargetModel;
                let model = ui.item.sortable.model;

                let succes = true;

                if(droptargetModel.length > 0){
                    for(let i = 0; i < droptargetModel.length; i++){
                        if(droptargetModel[i] == model){
                            succes = false;
                            break
                        }
                    }
                }
                else {
                    succes = true;
                }

                if(succes){
                    if(typeof model.answers != 'undefined' && model.type == 1){
                        answers: for(let i = 0; i < model.answers.length; i++){
                            if(typeof model.answers[i].child_questions != 'undefined'){
                                if(model.answers[i].child_questions.length > 0){
                                    for(let j = 0; j < model.answers[i].child_questions.length; j++){
                                        if(typeof model.answers[i].child_questions[j].delete == 'undefined'){
                                            ui.item.sortable.cancel();
                                            toastr.error('Can not contain questions');
                                            break answers;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        vm.sortableOptionAnswer = {
            'ui-floating': true,
        };
        vm.sortableOptionsQuestionInAnswer = {
            connectWith: ".question-container",
            'ui-floating': true,
        };

        function save() {
            let dataForSend = angular.copy(vm.items);

            if(dataForSend.length > 0){
                dataForSend.forEach(function (itemQuestion, indexQuestion) {
                    itemQuestion.order_number = indexQuestion;
                    itemQuestion.child_order_number = null;
                    if(itemQuestion.type == 1){
                        itemQuestion.answers.forEach(function (itemAnswer, indexAnswer) {
                            itemAnswer.order_number = indexAnswer;
                            itemAnswer.child_questions.forEach(function (itemQuestionInAnswer, indexQuestionInAnswer) {
                                itemQuestionInAnswer.child_order_number = indexQuestionInAnswer;
                                itemQuestionInAnswer.order_number = null;
                                if(itemQuestionInAnswer.type == 1){
                                    itemQuestionInAnswer.answers.forEach(function (itemAnswerInChildQuestion, indexAnswerInChildQuestion) {
                                        itemAnswerInChildQuestion.order_number = indexAnswerInChildQuestion;
                                        if(typeof itemQuestionInAnswer.id != 'undefined'){
                                            itemAnswerInChildQuestion.question_id = itemQuestionInAnswer.id;
                                        }
                                    });
                                }
                            });
                        });
                    }
                });

                blockService.addBlockQuestion(idBlock, dataForSend).then(function (res) {
                    if(res.success){
                        vm.items = res.data.questions;
                        items[indexBlock].questions = res.data.questions;
                    }
                })
            }
        }

        function deleteQuest(id, mainKey, answerKey, questionKey) {
            $mdDialog.show({
                controller: 'DeleteViewController',
                controllerAs: 'vm',
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            }).then(function () {
                if(typeof questionKey != 'undefined') {
                    if(typeof id == 'undefined') {
                        vm.items[mainKey].answers[answerKey].child_questions.splice(questionKey, 1);
                    }
                    else {
                        vm.items[mainKey].answers[answerKey].child_questions[questionKey].delete = true;
                    }

                }
                else {
                    if(typeof id == 'undefined') {
                        vm.items.splice(mainKey, 1);
                    }
                    else {
                        vm.items[mainKey].delete = true;
                    }
                }
            });
        }

        function showEdit(mainKey, answerKey, questionKey) {
            $mdDialog.show({
                controller: 'AddQuestionController',
                controllerAs: 'vm',
                locals: {
                    data: {
                        mainKey: mainKey,
                        answerKey: answerKey,
                        questionKey: questionKey,
                        items: vm.items,
                    }
                },
                templateUrl: 'components/survey-question/addQuest/addQuest.html',
                clickOutsideToClose: true,
            })
        }
    }
})();