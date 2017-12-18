;(function () {
    'use strict';

    angular.module('app')
        .controller('PassingQuestionController', PassingQuestionController);


    PassingQuestionController.$inject = ['$scope', 'userService', '$state', 'customers', 'customerAnswer', 'survey' , 'toastr'];

    function PassingQuestionController($scope, userService, $state, customers, customerAnswer, survey , toastr) {
        let vm = this;

        vm.next = next;
        vm.back = back;
        vm.nextSucces = true;
        vm.backSucces = false;

        let succesNext = true;

        vm.data = [];

        console.log(customerAnswer, 'customaerAnswer');

        let indexActiveBlock;

        let items = userService.getItems();
        let indexActiveSurvey = survey.getActiveQuestionair();
        let idActiveSurvey = items[indexActiveSurvey].id;
        let activeCustomers = customers.getActiveCustomers();

        let mainQuestionInBlock;
        let customerAnswerOnActiveBlock;

        for(let j = 0; j < customerAnswer.length; j++){
            if(customerAnswer[j].customerAnswers.length == 0){
                for(let i = 0; i < items[indexActiveSurvey].blocks.length; i++){
                    if(customerAnswer[j].block_id == items[indexActiveSurvey].blocks[i].id){
                        indexActiveBlock = i;
                        break
                    }
                }
                break
            }
        }

        if(typeof indexActiveBlock == 'undefined'){
            indexActiveBlock = 0;
        }

        generete();
        fill();
        start();

        function generete() {
            mainQuestionInBlock = items[indexActiveSurvey].blocks[indexActiveBlock].questions;
            console.log('mainQuestionInBlock', mainQuestionInBlock);
        }

        function fill() {
            // customerAnswerOnActiveBlock = [];
            //
            // let idActiveBlock = items[indexActiveSurvey].blocks[indexActiveBlock].id;
            //
            // for(let i = 0; i < customerAnswer.length; i++){
            //     if(customerAnswer[i].block_id == idActiveBlock){
            //         customerAnswerOnActiveBlock = customerAnswer[i].customerAnswers;
            //         break
            //     }
            // }
            //
            // customerAnswerOnActiveBlock.forEach(function (item) {
            //     for(let i = 0; i < allQuestionBlock.length; i++){
            //         if(item.question_id == allQuestionBlock[i].id){
            //             if(allQuestionBlock[i].type == 1){
            //                 vm.data[i] = item.answer_id;
            //             }
            //             else{
            //                 vm.data[i] = item.value;
            //             }
            //             break
            //         }
            //     }
            // })
        }


        function start() {
            if(mainQuestionInBlock.length == 0){
                console.log('no question in block');
                $state.go('tab.user-management');
            }
            else{
                vm.questions = mainQuestionInBlock;
                vm.header = items[indexActiveSurvey].blocks[indexActiveBlock].name;
                if(indexActiveBlock > 0){
                    vm.backSucces = true;
                }
                else{
                    vm.backSucces = false;
                }
            }
        }

        function next() {

            succesNext = true;

            console.log(vm.data, 'all answers in block');
            console.log(mainQuestionInBlock, 'all question in block');

            let dataForSend = [];

            vm.data.forEach(function (itemQuestion, indexQuestion) {

                checkForFill(itemQuestion.mainData);

                if(mainQuestionInBlock[indexQuestion].type == 1) {
                    let tmpObj = {
                        id: mainQuestionInBlock[indexQuestion].id,
                        answer_id: itemQuestion.mainData
                    };
                    dataForSend.push(tmpObj);

                    mainQuestionInBlock[indexQuestion].answers.forEach(function (itemAnswer, indexAnswer) {
                        if(itemAnswer.child_questions.length > 0){
                            if(itemQuestion.mainData == itemAnswer.id){
                                itemAnswer.child_questions.forEach(function (itemChildQuestion, indexChildQuestion) {
                                    let tmpObj = {
                                        id: itemChildQuestion.id,
                                    };
                                    if(itemChildQuestion.type == 1){
                                        tmpObj.answer_id = itemQuestion.answerData[indexAnswer].childData[indexChildQuestion]
                                    }
                                    else {
                                        tmpObj.answer_text = itemQuestion.answerData[indexAnswer].childData[indexChildQuestion]
                                    }
                                    dataForSend.push(tmpObj);

                                    checkForFill(itemQuestion.answerData[indexAnswer].childData[indexChildQuestion]);

                                });
                            }
                            else {
                                itemAnswer.child_questions.forEach(function (itemChildQuestion) {
                                    let tmpObj = {
                                        id: itemChildQuestion.id,
                                        delete: true
                                    };
                                    dataForSend.push(tmpObj);
                                })
                            }
                        }
                    })
                }
                else {
                    let tmpObj = {
                        id: mainQuestions[indexQuestion].id,
                        answer_text: itemQuestion.mainData
                    };
                    dataForSend.push(tmpObj);
                }

                console.log('dataForSend', dataForSend)

                if(!succesNext){
                    console.log('not all is fill')
                }


            })
        }

        function checkForFill (item){
            if(typeof item == 'undefined' || item == ''){
                succesNext = false;
            }
        }

        function back() {
            if(indexActiveBlock > 0){
                let id = {
                    customer: activeCustomers,
                    survey: idActiveSurvey
                };
                userService.getCustomerAnswer(id).then(function (res) {
                    if(res.success){
                        customerAnswer = res.data.customerAnswers
                    }
                    else{
                        console.log('error customer answer');
                    }
                });
                indexActiveBlock--;
                vm.data = [];
                generete();
                fill();
                start();
            }
        }



        function toNextBlock() {
            if(items[indexActiveSurvey].blocks.length - 1 > indexActiveBlock){
                let id = {
                    customer: activeCustomers,
                    survey: idActiveSurvey
                };
                userService.getCustomerAnswer(id).then(function (res) {
                    if(res.success){
                        customerAnswer = res.data.customerAnswers
                    }
                    else{
                        console.log('error customer answer');
                    }
                });
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
                        toastr.success('Completed');
                    }
                    else {
                        console.log('error');
                    }
                })
            }
        }
    }

})();
