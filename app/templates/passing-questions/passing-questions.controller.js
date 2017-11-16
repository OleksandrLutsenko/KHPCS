;(function () {
    'use strict';

    angular.module('app')
        .controller('PassingQuestionController', PassingQuestionController);


    PassingQuestionController.$inject = ['userService', '$state', '$mdDialog', 'customers', '$scope'];

    function PassingQuestionController(userService, $state, $mdDialog, customers, $scope) {
        let vm = this;

        vm.next = next;


        let indexActiveSurvey = 0;
        let indexActiveBlock = 0;
        let indexActiveQuestion = 0;

        let activeCustomers = customers.getActiveCustomers();
        let items = userService.getItems();

        let activeSurvey = items[indexActiveSurvey];

        let activeSurveyId = activeSurvey.id;

        let activeBlock = activeSurvey.blocks[indexActiveBlock];
        vm.activeQuestion = activeBlock.questions[indexActiveQuestion];

        let id = {
            customer: activeCustomers,
            survey: activeSurveyId
        };

        let customerAnswer = userService.getCustomerAnswer(id);

        vm.aaaa = function () {
            console.log('sssssssssss');
            console.log(customerAnswer, 'customer answers all');
            console.log(JSON.stringify(customerAnswer));
        };


        // if(customerAnswer.$$state.value.data.customerAnswers.length > 0){
        //     console.log('in progress')
        // }


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
