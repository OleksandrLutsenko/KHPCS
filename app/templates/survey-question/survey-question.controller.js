;(function () {
    'use strict';
    angular
        .module('app')
        .controller('SurveyQuestionController', SurveyQuestionController);

    SurveyQuestionController.$inject = ['survey', '$scope', '$mdDialog', 'blockService', 'toastr', 'items', 'tabsService', 'surveyService'];

    function SurveyQuestionController(survey, $scope, $mdDialog, blockService, toastr, items, tabsService, surveyService) {
        let vm = this;
        tabsService.startTab();

        let activeBlock = survey.getActiveBlock();
        let indexBlock = activeBlock.indexBlock;
        let idBlock = activeBlock.id;

        vm.items = items[indexBlock].questions;
        vm.nameBlock = items[indexBlock].name;
        vm.edit = true;

        vm.cancel = cancel;
        vm.save = save;
        vm.showEdit = showEdit;
        vm.deleteQuest = deleteQuest;
        vm.toggleLeft = toggleLeft;
        vm.editButton = editButton;


        $scope.$on('setActiveBlock', function (event, data) {
            activeBlock = data.activeBlock;
            indexBlock = activeBlock.indexBlock;
            idBlock = activeBlock.id;

            vm.items = items[indexBlock].questions;
            vm.nameBlock = items[indexBlock].name;
        });

        function toggleLeft() {
            $scope.$emit('showBlock', true);
        }
        function editButton() {
            vm.edit = !vm.edit;

            vm.sortableOptionsQuestion.disabled = vm.edit;

            vm.sortableOptionAnswer.disabled = vm.edit;

            vm.sortableOptionsQuestionInAnswer.disabled = vm.edit;

        }

        vm.sortableOptionsQuestion = {
            disabled: vm.edit,
            connectWith: ".question-container",
            'ui-floating': true,

            start: function (e, ui) {
                $scope.$apply(function() {
                    vm.childDraging = true;
                });
                console.log('start', vm.childDraging);
            },
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
            },
            stop: function (e, ui) {
                vm.childDraging = false;
                console.log('stop', vm.childDraging);
            }
        };
        vm.sortableOptionAnswer = {
            disabled: vm.edit,
            connectWith: ".answer-container",
            'ui-floating': true,
        };
        vm.sortableOptionsQuestionInAnswer = {
            disabled: vm.edit,
            connectWith: ".question-container",
            'ui-floating': true,

            start: function (e, ui) {
                $scope.$apply(function() {
                    vm.childDraging = true;
                });
                console.log('start', vm.childDraging);
                // vm.sortableOptionsQuestion = {
                //     disabled: true
                // }
            },
            update: function (e, ui) {
                console.log('update', vm.childDraging);
                // vm.childDraging = true;
            },
            stop: function (e, ui) {
                vm.childDraging = false;
                console.log('stop', vm.childDraging);
                // vm.sortableOptionsQuestion ={
                //     disabled: false
                // }
            }

        };

        // $scope.$watch(vm.childDraging, function () {
        //    console.log('childDraging', vm.childDraging);
        // });

        function cancel() {
            let idSurvey = survey.getActiveSurvey().id;

            surveyService.loadOneSurvey(idSurvey).then(function (res) {
                if(res.success){
                    items = res.data.survey.blocks;
                    vm.items = items[indexBlock].questions;
                    editButton();
                }
            });
        }


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
                        editButton();
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