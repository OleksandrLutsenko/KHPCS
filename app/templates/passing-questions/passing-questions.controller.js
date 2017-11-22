;(function () {
    'use strict';

    angular.module('app')
        .controller('PassingQuestionController', PassingQuestionController);


    PassingQuestionController.$inject = ['$scope', 'userService', '$state', 'customers', 'customaerAnswer', 'survey'];

    function PassingQuestionController($scope, userService, $state, customers, customaerAnswer, survey) {
        let vm = this;

        vm.next = next;

        vm.dataIdAnswers = [];
        vm.data = [];





        let indexActiveBlock = 0;

        let indexActiveSurvey = survey.getActiveQuestionair();
        let activeCustomers = customers.getActiveCustomers();
        let items = userService.getItems();

        let activeSurvey = items[indexActiveSurvey];
        let activeSurveyId = activeSurvey.id;

        let activeBlock = activeSurvey.blocks[0];
        console.log(activeBlock);

        let allQuestionBlock = [];
        let allQuestionBlockNoExtra = [];
        let allAnswersBlock = [];
        let allAnswersMassBlock = [];
        let answersBlockExtra = [];

        activeSurvey.blocks[indexActiveBlock].questions.forEach(function(item) {
            allQuestionBlock.push(item);
            allAnswersMassBlock.push(item.answers);
            item.answers.forEach(function (item) {
                if(item.hasExtra == 1){
                    answersBlockExtra.push(item)
                }
                allAnswersBlock.push(item);
            });
            // if(item.extra == 0){
            //     allQuestionBlockNoExtra.push(item);
            // }


        });

        $scope.$watchCollection('vm.data', function() {
            console.log('hey, data has changed!');
            console.log(answersBlockExtra, 'answersBlockExtra!');

            let indexQuestion;

            allQuestionBlock.forEach(function (item, index) {
                if(item.extra == 1){
                    for (let i = 0; i < answersBlockExtra.length; i++){
                        if(item.identifier == answersBlockExtra.next_question){
                            for(let j = 0; j < allQuestionBlock; j++){
                                if(allQuestionBlock.id == answersBlockExtra[i].question_id){
                                    indexQuestion = j;
                                    break
                                }
                            }
                            // ifvm.data
                        }
                    }
                }
            });
        });


        if(allQuestionBlock.length === 0){
            console.log('no question in block');
            $state.go('tab.user-management');
        }
        else{
            vm.questions = allQuestionBlock;
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

        function next() {

            console.log(vm.data, 'all answers in block');
            console.log(answersBlockExtra, 'all answers answersBlockExtra');
            console.log(allQuestionBlock, 'all question in block');
            console.log(allAnswersMassBlock, 'allAnswersMassBlock');
            allQuestionBlockNoExtra = [];
            allQuestionBlock.forEach(function (item) {
               if(item.extra == 0 || item.extraAfte == 0){
                   allQuestionBlockNoExtra.push(item);
               }
            });

            console.log(allQuestionBlockNoExtra, 'all question in block no extra');


            // allQuestionBlockNoExtra.forEach(function (item, index) {
            //     let data;
            //
            //     let id = {
            //         customer: activeCustomers,
            //         question: item.id
            //     };
            //
            //     if(item.type == 1){
            //         data = {
            //             answer_id: vm.data[index]
            //         };
            //     }
            //     else {
            //         data = {
            //             answer_text:  vm.data[index]
            //         };
            //     }
            //     console.log(data, 'what we send');
            //     userService.sendCustomerAnswer(id, data).then(function (res) {
            //             if(res.success){
            //                console.log(index, 'question send succes')
            //             }
            //         })
            // })

            // let data;
            //
            // let id = {
            //     customer: activeCustomers,
            //     question: vm.activeQuestion.id
            // };
            // if(type === 1){
            //     data = {
            //         answer_id: vm.dataIdAnswers
            //     };
            // }
            // else {
            //     data = {
            //         answer_text: vm.dataTextAnswers
            //     };
            // }
            //
            // userService.sendCustomerAnswer(id, data).then(function (res) {
            //     if(res.success){
            //        if(res.data.next_question === 'This is the last question in this survey' || res.data.next_question === null){
            //             console.log('This is the last question in this survey');
            //             let data = {
            //                 customer_id: activeCustomers,
            //                 survey_id: activeSurveyId
            //             };
            //             userService.createReport(data).then(function (res) {
            //                 if(res.success){
            //                     console.log('Report created');
            //                     $state.go('tab.user-management');
            //                 }
            //             })
            //        }
            //        else{
            //            vm.activeQuestion = res.data.next_question;
            //            getType();
            //        }
            //     }
            // })
        }
    }

})();
