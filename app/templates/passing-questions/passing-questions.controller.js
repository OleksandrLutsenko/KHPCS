;(function () {
    'use strict';

    angular.module('app')
        .controller('PassingQuestionController', PassingQuestionController);


    PassingQuestionController.$inject = ['userService', '$state', '$mdDialog', 'customers', '$scope', 'customaerAnswer', 'survey'];

    function PassingQuestionController(userService, $state, $mdDialog, customers, $scope, customaerAnswer, survey) {
        let vm = this;

        vm.next = next;

        console.log(customaerAnswer, 'customaerAnswer');


        let indexActiveSurvey = survey.getActiveQuestionair();
        console.log(indexActiveSurvey);
        let indexActiveBlock = 0;
        let indexActiveQuestion = 0;

        let activeCustomers = customers.getActiveCustomers();
        let items = userService.getItems();

        let activeSurvey = items[indexActiveSurvey];

        let activeSurveyId = activeSurvey.id;

        let activeBlock = activeSurvey.blocks[indexActiveBlock];



        if(customaerAnswer.data.customerAnswers.length > 0 && customaerAnswer.data.status === 'completed'){
                console.log('compleated');
        }
        else{
            if(customaerAnswer.data.customerAnswers.length > 0){
                let LastPassQuestion = customaerAnswer.data.customerAnswers[customaerAnswer.data.customerAnswers.length - 1];

                let allQuestion = [];

                activeSurvey.blocks.forEach(function(item, i, arr) {
                    item.questions.forEach(function (item, i, arr) {
                        allQuestion.push(item);
                    })
                });

                for(let indexQuestion = 0; indexQuestion < allQuestion.length; indexQuestion++){
                    if(allQuestion[indexQuestion].id === LastPassQuestion.question_id){
                        if(allQuestion[indexQuestion].type === 1){
                            console.log('type === 1');
                            for(let indexAnswer = 0; indexAnswer < allQuestion[indexQuestion].answers.length; indexAnswer++){
                                if(allQuestion[indexQuestion].answers[indexAnswer].id === LastPassQuestion.answer_id){
                                    let nextQuestion = allQuestion[indexQuestion].answers[indexAnswer].next_question;
                                    for (let index = 0; index < allQuestion.length; index++){
                                        if(allQuestion[index].identifier === nextQuestion){
                                            vm.activeQuestion = allQuestion[index];
                                            break
                                        }
                                    }
                                    break
                                }
                            }
                        }
                        else{
                            console.log('type === 2');
                            let nextQuestion = allQuestion[indexQuestion].next_question;
                            for (let index = 0; index < allQuestion.length; index++){
                                if(allQuestion[index].identifier === nextQuestion){
                                    vm.activeQuestion = allQuestion[index];
                                    break
                                }
                            }
                        }
                        break
                    }
                }
            }
            else{
                console.log('start');
                vm.activeQuestion = activeBlock.questions[indexActiveQuestion];
            }
        }

        //
        // $scope.mass = [{id:1, name:'first'}, {id:2, name:'second'}, {id:3, name:'three'}, {id:4, name:'fourth'}, {id:5, name:'five'}, {id:6, name:'six'}];
        // $scope.massFiltered = $scope.mass.filter(function (i) {
        //     return (i.id >= 2) && (i.id < 6);
        // });
        //


        function getType() {
            if(vm.activeQuestion.answers.length > 0 && vm.activeQuestion.type === 1){
                vm.typeQuestion = 1;
            }
            else {
                vm.typeQuestion = 2;
            }
        }

        getType();

        function next(type) {
            console.log('next is presed');

            let data;

            let id = {
                customer: activeCustomers,
                question: vm.activeQuestion.id
            };
            if(type === 1){
                console.log(vm.dataIdAnswers, 'id answer');
                data = {
                    answer_id: vm.dataIdAnswers
                };
            }
            else {
                data = {
                    answer_text: vm.dataTextAnswers
                };
            }

            console.log(data, 'data');

            userService.sendCustomerAnswer(id, data).then(function (res) {
                console.log(res);
                if(res.success){
                   if(res.data.next_question === 'This is the last question in this survey'){
                        console.log('last');
                        let data = {
                            customer_id: activeCustomers,
                            survey_id: activeSurveyId
                        };
                        console.log(data, 'data id customer and customers');
                        userService.createReport(data).then(function (res) {
                            console.log(res);
                            if(res.success){
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

        // for(let i = 0; i < activeSurvey.blocks.length; i++){
        //     for (let j = 0; j < activeSurvey.blocks[i].length; j++){
        //         console.log(j);
        //     }
        //
        // }

        // activeSurvey.blocks.forEach(function (item, i, arr) {
        //     item.questions.forEach(function (item, i, arr) {
        //         console.log(item);
        //     })
        // });






        //     .config(function ($mdThemingProvider) {
        //         $mdThemingProvider.theme('docs-dark', 'default')
        //             .primaryPalette('yellow')
        //             .dark();
        //     })
        // //////////
    }

})();
