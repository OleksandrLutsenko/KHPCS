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

        let activeCustomers = customers.getActineCustomers();
        let items = userService.getItems();

        let activeSurvey = items[indexActiveSurvey];
        let activeBlock = activeSurvey.blocks[indexActiveBlock];
        vm.activeQuestion = activeBlock.questions[indexActiveQuestion];

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
                   console.log('ok');
                    vm.activeQuestion = res.data.next_question;
                    getType();
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
