;(function () {
    'use strict';

    angular.module('app')
        .controller('PassingQuestionController', PassingQuestionController);


    PassingQuestionController.$inject = ['$scope', 'userService', '$state', 'customers', 'customaerAnswer', 'survey', '$q'];

    function PassingQuestionController($scope, userService, $state, customers, customaerAnswer, survey, $q) {
        let vm = this;

        vm.next = next;
        vm.nextSucces = false;

        vm.data = [];
        //-!!-//
        console.log(customaerAnswer, 'customaerAnswer');

        let indexActiveBlock;

        let items = userService.getItems();
        let indexActiveSurvey = survey.getActiveQuestionair();
        let idActiveSurvey = items[indexActiveSurvey].id;
        let activeCustomers = customers.getActiveCustomers();


        let allQuestionBlock;
        let allAnswersBlock;

        let customerAnswerOnActiveBlock;

        if(customaerAnswer.status == 'continue'){
            indexActiveBlock = 0;
        }
        else{
            for(let i = 0; i < items[indexActiveSurvey].blocks.length; i++){
                if(customaerAnswer.data.customerAnswers[customaerAnswer.data.customerAnswers.length - 1].block_id == items[indexActiveSurvey].blocks[i].id){
                    if(items[indexActiveSurvey].blocks.length - 1 == i){
                        indexActiveBlock = i;
                    }
                    else{
                        indexActiveBlock = i + 1;
                    }
                    break
                }
            }
        }

        generete();
        fill();
        start();

        function generete() {

            allAnswersBlock = [];

            let activeBlock = items[indexActiveSurvey].blocks[indexActiveBlock];
            console.log(activeBlock, 'active block');

            allQuestionBlock = activeBlock.questions;

            activeBlock.questions.forEach(function(item) {
                item.answers.forEach(function (item) {
                    allAnswersBlock.push(item);
                });
            });
        }

        function fill() {

            customerAnswerOnActiveBlock = [];

            let idActiveBlock = items[indexActiveSurvey].blocks[indexActiveBlock].id;

            for(let i = 0; i < customaerAnswer.data.customerAnswers.length; i++){
                if(customaerAnswer.data.customerAnswers[i].block_id == idActiveBlock){
                    customerAnswerOnActiveBlock = customaerAnswer.data.customerAnswers[i].customerAnswers;
                    break
                }
            }

            customerAnswerOnActiveBlock.forEach(function (item) {
                for(let i = 0; i < allQuestionBlock.length; i++){
                    if(item.question_id == allQuestionBlock[i].id){
                        if(allQuestionBlock[i].type == 1){
                            vm.data[i] = item.answer_id;
                        }
                        else{
                            vm.data[i] = item.value;
                        }
                        break
                    }
                }
            })
        }

        $scope.$watchCollection('vm.data', function() {
            console.log('hey, data has changed!');

            let indexQuestion;

            let couterAnswer = 0;
            let couterQuestion = 0;

            allQuestionBlock.forEach(function (item, index) {
                if(item.extra == 1){
                    for (let i = 0; i < allAnswersBlock.length; i++){
                        if(item.identifier == allAnswersBlock[i].next_question){
                            for(let j = 0; j < allQuestionBlock.length; j++){
                                if(allQuestionBlock[j].id == allAnswersBlock[i].question_id){
                                    indexQuestion = j;
                                    break
                                }
                            }
                            if(vm.data[indexQuestion] == allAnswersBlock[i].id){
                                item.extraAfte = 0
                            }
                            else {
                                item.extraAfte = 1
                            }
                            break
                        }
                    }
                }
                if(item.extra == 0 || item.extraAfte == 0){
                    couterQuestion++;
                    if(typeof vm.data[index] != 'undefined' && vm.data[index] != ''){
                        couterAnswer++;
                    }
                }
            });

            console.log(couterAnswer, couterQuestion);

            if(couterAnswer == couterQuestion){
                console.log('next question true');
                vm.nextSucces = true
            }
            else{
                vm.nextSucces = false
            }

        });


        function start() {
            if(allQuestionBlock.length === 0){
                console.log('no question in block');
                $state.go('tab.user-management');
            }
            else{
                vm.questions = allQuestionBlock;
            }
        }



        function next() {

            let deferred = $q.defer();

            console.log(vm.data, 'all answers in block');
            console.log(allQuestionBlock, 'all question in block');

            allQuestionBlock.forEach(function (item, index) {
                if(item.extra == 0 || item.extraAfte == 0){
                    // debugger;
                    let data;

                    let id = {
                        customer: activeCustomers,
                        question: item.id
                    };

                    if(item.type == 1){
                        data = {
                            answer_id: vm.data[index]
                        };
                    }
                    else {
                        data = {
                            answer_text:  vm.data[index]
                        };
                    }
                    console.log(data, 'what we send');
                    userService.sendCustomerAnswer(id, data).then(function (res) {
                        if(res.success){
                            console.log(index, 'question send succes');
                        }
                    })
                }
            });
            toNextBlock();
        }

        function toNextBlock() {
            if(items[indexActiveSurvey].blocks.length - 1 > indexActiveBlock){
                indexActiveBlock++;
                vm.data = [];
                generete();
                fill();
                start();
            }
            else{
                let data = {
                    customer_id: activeCustomers,
                    survey_id: idActiveSurvey
                };
                userService.createReport(data).then(function (res) {
                    if(res.success){
                        $state.go('tab.user-management');
                    }
                    else {
                        console.log('error');
                    }
                })
            }
        }
    }

})();
