;(function () {
    'use strict';
    angular
        .module('app')
        .controller('SurveyQuestionController', SurveyQuestionController);

    SurveyQuestionController.$inject = ['survey', '$scope', '$mdDialog', 'blockService', 'toastr', 'items', 'tabsService'];

    function SurveyQuestionController(survey, $scope, $mdDialog, blockService, toastr, items, tabsService) {
        let vm = this;
        tabsService.startTab();

        let idB = survey.getActiveBlock();
        let indexBlock = idB.indexBlock;
        let idBlock = idB.id;

        vm.items = items[indexBlock].questions;

        vm.save = save;
        vm.showEdit = showEdit;
        vm.deleteQuest = deleteQuest;


        $scope.$on('parent', function (event, data) {
            indexBlock = data;
            vm.items = items[indexBlock].questions;
            idB = survey.getActiveBlock();
            idBlock = idB.id;
        });

        console.log(vm.items);

        vm.sortableOptionsQuestion = {
            connectWith: ".question-container",
            'ui-floating': true,

            update: function (event, ui) {
                let droptargetModel = ui.item.sortable.droptargetModel;
                let model = ui.item.sortable.model;

                let succes = true;

                console.log('droptargetModel', droptargetModel);

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
                        for(let i = 0; i < model.answers.length; i++){
                            if(typeof model.answers[i].child_questions != 'undefined'){
                                if(model.answers[i].child_questions.length > 0){
                                    for(let j = 0; j < model.answers[i].child_questions.length; j++){
                                        if(typeof model.answers[i].child_questions[j].delete == 'undefined'){
                                            ui.item.sortable.cancel();
                                            toastr.error('Can not contain questions');
                                            break
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
            let dataForSand = angular.copy(vm.items);

            console.log('dataForSand', dataForSand);

            dataForSand.forEach(function (itemQuestion, indexQuestion) {
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
                                })
                            }
                        })
                    })
                }
            });

            console.log('dataForSand', dataForSand);

            blockService.addBlockQuestion(idBlock, dataForSand).then(function (res) {
                console.log(res);
                if(res.success){
                    vm.items = res.data.questions;
                    items[indexBlock].questions = res.data.questions;
                }
            })
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
                        // let surveyId = idS.id;
                        // let templates;
                        //
                        // userService.loadAllTemplates().then(function (res) {
                        //     if(res.success) {
                        //         // if (res.length) {
                        //         templates = res.data;
                        //
                        //         for (let i=0; i<templates.length; i++) {
                        //             if (templates[i].survey_id === surveyId) {
                        //                 let templateId = templates[i].id;
                        //                 let data = templates[i];
                        //                 // console.log(data);
                        //
                        //                 let tmpVar = "{!!$contractAnswers["+ id +"]!!}";
                        //                 data.body = data.body.split(tmpVar).join('<span style="background-color: #ff0000">[undefined]</span>');
                        //                 userService.updateTemplate(templateId, data).then(function (res) {
                        //                     console.log(res);
                        //                     if (res.success) {
                        //                         console.log('Update template success');
                        //                     } else{
                        //                         console.log('Update template error');
                        //                     }
                        //                 });
                        //             }
                        //         }
                        //         // }
                        //     }else {
                        //         console.log('load templates error');
                        //     }
                        // });
            })
        }

        function showEdit(mainKey, answerKey, questionKey) {
            console.log('mainKey', mainKey);
            console.log('answerKey', answerKey);
            console.log('questionKey',questionKey);
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