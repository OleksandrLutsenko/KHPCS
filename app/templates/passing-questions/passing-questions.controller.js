;(function () {
    'use strict';

    angular.module('app')
        .controller('PassingQuestionController', PassingQuestionController);


    PassingQuestionController.$inject = ['$scope', 'userService', '$state', 'customers', 'customaerAnswer', 'survey'];

    function PassingQuestionController($scope, userService, $state, customers, customaerAnswer, survey) {
        let vm = this;

        vm.next = next;
        vm.back = back;
        vm.nextSucces = false;
        vm.backSucces = false;

        vm.data = [];

        console.log(customaerAnswer, 'customaerAnswer');

        let indexActiveBlock;

        let items = userService.getItems();
        let indexActiveSurvey = survey.getActiveQuestionair();
        let idActiveSurvey = items[indexActiveSurvey].id;
        let activeCustomers = customers.getActiveCustomers();

        let allQuestionBlock;
        let allAnswersBlock;

        let massForSend = [];
        let customerAnswerOnActiveBlock;

        for (let j = 0; j < customaerAnswer.data.customerAnswers.length; j++) {
            if (customaerAnswer.data.customerAnswers[j].customerAnswers.length == 0) {
                for (let i = 0; i < items[indexActiveSurvey].blocks.length; i++) {
                    if (customaerAnswer.data.customerAnswers[j].block_id == items[indexActiveSurvey].blocks[i].id) {
                        indexActiveBlock = i;
                        break
                    }
                }
                break
            }
        }

        if (typeof indexActiveBlock == 'undefined') {
            indexActiveBlock = items[indexActiveSurvey].blocks.length - 1;
        }

        generete();
        fill();
        start();

        function generete() {

            allAnswersBlock = [];

            let activeBlock = items[indexActiveSurvey].blocks[indexActiveBlock];
            console.log(activeBlock, 'active block');

            allQuestionBlock = activeBlock.questions;

            activeBlock.questions.forEach(function (item) {
                item.answers.forEach(function (item) {
                    allAnswersBlock.push(item);
                });
            });
        }

        function fill() {

            customerAnswerOnActiveBlock = [];

            let idActiveBlock = items[indexActiveSurvey].blocks[indexActiveBlock].id;

            for (let i = 0; i < customaerAnswer.data.customerAnswers.length; i++) {
                if (customaerAnswer.data.customerAnswers[i].block_id == idActiveBlock) {
                    customerAnswerOnActiveBlock = customaerAnswer.data.customerAnswers[i].customerAnswers;
                    break
                }
            }

            customerAnswerOnActiveBlock.forEach(function (item) {
                for (let i = 0; i < allQuestionBlock.length; i++) {
                    if (item.question_id == allQuestionBlock[i].id) {
                        if (allQuestionBlock[i].type == 1) {
                            vm.data[i] = item.answer_id;
                        }
                        else {
                            vm.data[i] = item.value;
                        }
                        break
                    }
                }
            })
        }

        $scope.$watchCollection('vm.data', function () {
            console.log('hey, data has changed!');

            let indexQuestion;

            let couterAnswer = 0;
            let couterQuestion = 0;

            allQuestionBlock.forEach(function (item, index) {
                if (item.extra == 1) {
                    for (let i = 0; i < allAnswersBlock.length; i++) {
                        if (item.identifier == allAnswersBlock[i].next_question) {
                            for (let j = 0; j < allQuestionBlock.length; j++) {
                                if (allQuestionBlock[j].id == allAnswersBlock[i].question_id) {
                                    indexQuestion = j;
                                    break
                                }
                            }
                            if (vm.data[indexQuestion] == allAnswersBlock[i].id) {
                                item.extraAfte = 0
                            }
                            else {
                                item.extraAfte = 1
                            }
                            break
                        }
                    }
                }
                if (item.extra == 0 || item.extraAfte == 0) {
                    couterQuestion++;
                    if (typeof vm.data[index] != 'undefined' && vm.data[index] != '') {
                        couterAnswer++;
                    }
                }
            });

            console.log(couterAnswer, couterQuestion);

            if (couterAnswer == couterQuestion) {
                console.log('next question true');
                vm.nextSucces = true
            }
            else {
                vm.nextSucces = false
            }

        });

        $scope.$watch('vm.couter', function () {
            if (massForSend.length == vm.couter) {
                toNextBlock();
            }
        });


        function start() {
            if (allQuestionBlock.length == 0) {
                console.log('no question in block');
                $state.go('tab.user-management');
            }
            else {
                vm.questions = allQuestionBlock;
                vm.header = items[indexActiveSurvey].blocks[indexActiveBlock].name;
                if (indexActiveBlock > 0) {
                    vm.backSucces = true;
                }
                else {
                    vm.backSucces = false;
                }
            }
        }

        function next() {

            vm.couter = 0;

            console.log(vm.data, 'all answers in block');
            console.log(allQuestionBlock, 'all question in block');

            massForSend = allQuestionBlock.filter(function (item) {
                return item.extra == 0 || item.extraAfte == 0;
            });

            console.log(massForSend);

            massForSend.forEach(function (item, index) {
                let data;

                let id = {
                    customer: activeCustomers,
                    question: item.id
                };

                if (item.type == 1) {
                    data = {
                        answer_id: vm.data[index]
                    };
                }
                else {
                    data = {
                        answer_text: vm.data[index]
                    };
                }
                userService.sendCustomerAnswer(id, data).then(function (res) {
                    if (res.success) {
                        console.log(index, 'question send succes');
                        vm.couter++
                    }
                })
            });
        }

        function back() {
            if (indexActiveBlock > 0) {
                indexActiveBlock--;
                vm.data = [];
                generete();
                fill();
                start();
            }
        }


        function toNextBlock() {
            if (items[indexActiveSurvey].blocks.length - 1 > indexActiveBlock) {
                indexActiveBlock++;
                vm.data = [];
                generete();
                fill();
                start();
            }
            else {
                let data = {
                    customer_id: activeCustomers,
                    survey_id: idActiveSurvey
                };
                userService.createReport(data).then(function (res) {
                    if (res.success) {
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
