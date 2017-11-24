;(function () {
    'use strict';

    angular.module('app')
        .controller('PassingQuestionController', PassingQuestionController);


    PassingQuestionController.$inject = ['$scope', 'userService', '$state', 'customers', 'customaerAnswer', 'survey'];

    function PassingQuestionController($scope, userService, $state, customers, customaerAnswer, survey) {
        let vm = this;

        vm.next = next;

        vm.data = [];
        //-!!-//
        console.log(customaerAnswer, 'customaerAnswer');

        let indexActiveBlock = 0;

        let indexActiveSurvey = survey.getActiveQuestionair();
        let activeCustomers = customers.getActiveCustomers();
        let items = userService.getItems();

        let allQuestionBlock = [];
        let allAnswersBlock = [];

        generete();
        start();

        function generete() {

            allQuestionBlock = [];
            allAnswersBlock = [];

            let activeBlock = items[indexActiveSurvey].blocks[indexActiveBlock];
            console.log(activeBlock, 'active block');


            activeBlock.questions.forEach(function(item) {
                allQuestionBlock.push(item);
                item.answers.forEach(function (item) {
                    allAnswersBlock.push(item);
                });
            });
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
                    if(vm.data[index] == 'undefined'){

                        couterAnswer++;
                        console.log(vm.data[index]);
                    }
                }
            });

            if(couterAnswer == couterQuestion){
                console.log('next question true');
                console.log(couterAnswer, couterQuestion);
            }

        });

        // debugger;

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

            console.log(vm.data, 'all answers in block');
            console.log(allQuestionBlock, 'all question in block');

            allQuestionBlock.forEach(function (item, index) {
                if(item.extra == 0 || item.extraAfte == 0){

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

            if(items[indexActiveSurvey].blocks.length - 1 > indexActiveBlock){
                indexActiveBlock++;
                vm.data = [];
                generete();
                start();
            }
            else{
                $state.go('tab.user-management');
            }
        }
    }

})();
