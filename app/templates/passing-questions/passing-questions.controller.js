;(function () {
    'use strict';

    angular.module('app')
        .controller('PassingQuestionController', PassingQuestionController);


    PassingQuestionController.$inject = ['userService', '$state', 'customers', 'customaerAnswer', 'survey'];

    function PassingQuestionController(userService, $state, customers, customaerAnswer, survey) {
        let vm = this;

        vm.next = next;

        let indexActiveSurvey = survey.getActiveQuestionair();
        let activeCustomers = customers.getActiveCustomers();
        let items = userService.getItems();

        let activeSurvey = items[indexActiveSurvey];
        let activeSurveyId = activeSurvey.id;

        let activeBlock = activeSurvey.blocks[0];
        console.log(activeBlock);

        let allQuestion = [];

        activeSurvey.blocks.forEach(function(item) {
            item.questions.forEach(function (item) {
                allQuestion.push(item);
            })
        });

        function getType() {
            console.log(vm.activeQuestion);
            if(vm.activeQuestion.type === 1){
                vm.typeQuestion = 1;
            }
            else {
                vm.typeQuestion = 2;
            }
        }

        if(allQuestion.length === 0){
            console.log('no question in active survey');
            $state.go('tab.user-management');
        }
        else{
            vm.questions = activeBlock.questions
        }
        // else if(customaerAnswer.data.status === 'completed'){
        //     console.log('compleated active survey');
        //     $state.go('tab.user-management');
        // }
        // else {
        //     if(customaerAnswer.data.customerAnswers.length > 0){
        //         let LastPassQuestion = customaerAnswer.data.customerAnswers[customaerAnswer.data.customerAnswers.length - 1];
        //
        //
        //
        //         for(let indexQuestion = 0; indexQuestion < allQuestion.length; indexQuestion++){
        //             if(allQuestion[indexQuestion].id === LastPassQuestion.question_id){
        //                 if(allQuestion[indexQuestion].type === 1){
        //                     console.log('type === 1');
        //                     for(let indexAnswer = 0; indexAnswer < allQuestion[indexQuestion].answers.length; indexAnswer++){
        //                         if(allQuestion[indexQuestion].answers[indexAnswer].id === LastPassQuestion.answer_id){
        //                             let nextQuestion = allQuestion[indexQuestion].answers[indexAnswer].next_question;
        //                             for (let index = 0; index < allQuestion.length; index++){
        //                                 if(allQuestion[index].identifier === nextQuestion){
        //                                     vm.activeQuestion = allQuestion[index];
        //                                     break
        //                                 }
        //                             }
        //                             break
        //                         }
        //                     }
        //                 }
        //                 else{
        //                     console.log('type === 2');
        //                     let nextQuestion = allQuestion[indexQuestion].next_question;
        //                     for (let index = 0; index < allQuestion.length; index++){
        //                         if(allQuestion[index].identifier === nextQuestion){
        //                             vm.activeQuestion = allQuestion[index];
        //                             break
        //                         }
        //                     }
        //                 }
        //                 break
        //             }
        //         }
        //     }
        //     else{
        //         console.log('start');
        //         vm.activeQuestion = allQuestion[0];
        //     }
        //     getType();
        // }

        function next(type) {
            let data;

            let id = {
                customer: activeCustomers,
                question: vm.activeQuestion.id
            };
            if(type === 1){
                data = {
                    answer_id: vm.dataIdAnswers
                };
            }
            else {
                data = {
                    answer_text: vm.dataTextAnswers
                };
            }

            userService.sendCustomerAnswer(id, data).then(function (res) {
                if(res.success){
                   if(res.data.next_question === 'This is the last question in this survey' || res.data.next_question === null){
                        console.log('This is the last question in this survey');
                        let data = {
                            customer_id: activeCustomers,
                            survey_id: activeSurveyId
                        };
                        userService.createReport(data).then(function (res) {
                            if(res.success){
                                console.log('Report created');
                                $state.go('tab.user-management');
                            }
                        })
                   }
                   else{
                       vm.activeQuestion = res.data.next_question;
                       getType();
                   }
                }
            })
        }
    }

})();
