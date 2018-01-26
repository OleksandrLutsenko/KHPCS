;(function () {
    'use strict';

    angular.module('app')
        .controller('PassingQuestionController', PassingQuestionController);


    PassingQuestionController.$inject = ['countries', 'passingQuestionService', '$state', 'customers', 'customerAnswer', 'oneSurveyItems', 'toastr', 'tabsService', 'surveyService', 'survey'];

    function PassingQuestionController(countries, passingQuestionService, $state, customers, customerAnswer, oneSurveyItems, toastr, tabsService, surveyService, survey) {
        let vm = this;
        tabsService.startTab('page1');

        vm.toggle = toggle;
        vm.exists = exists;
        vm.next = next;
        vm.back = back;
        vm.backSucces = false;
        let succesNext = true;
        vm.data = [];

        vm.activeSurveyName = oneSurveyItems.name;

        console.log(customerAnswer, 'customaerAnswer');

        let indexActiveBlock;

        let items = oneSurveyItems;
        let idActiveSurvey = items.id;
        let activeCustomers = customers.getActiveCustomers();

        let mainQuestionInBlock;
        let customerAnswerOnActiveBlock;

        if (customerAnswer != undefined) {
            for (let j = 0; j < customerAnswer.length; j++) {
                if (customerAnswer[j].customerAnswers.length == 0) {
                    for (let i = 0; i < items.blocks.length; i++) {
                        if (customerAnswer[j].block_id == items.blocks[i].id && items.blocks[i].questions.length > 0) {
                            indexActiveBlock = i;
                            break
                        }
                    }
                    break
                }
            }
            if (typeof indexActiveBlock == 'undefined') {
                indexActiveBlock = 0;
            }

            generete();
            fill();
            start();
        }
        else {
            toastr.error('No block in active survey');
            $state.go('tab.user-management');
        }

        vm.cities = countries;
        vm.querySearch = querySearch;

        function querySearch(query) {
            return query ? vm.cities.filter(createFilterFor(query)) : vm.cities;
        }

        function createFilterFor(query) {

            let lowercaseQuery = query;

            return function filterFn(city) {
                return (city.indexOf(lowercaseQuery) === 0);
            };

        }

        function toggle(item, list) {
            let idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
        }

        function exists(item, list) {
            return list.indexOf(item) > -1;
        }

        function generete() {
            mainQuestionInBlock = items.blocks[indexActiveBlock].questions;
            console.log('mainQuestionInBlock', mainQuestionInBlock);
        }

        function fill() {
            vm.data = [];
            customerAnswerOnActiveBlock = [];

            let idActiveBlock = items.blocks[indexActiveBlock].id;

            for (let i = 0; i < customerAnswer.length; i++) {
                if (customerAnswer[i].block_id == idActiveBlock) {
                    customerAnswerOnActiveBlock = customerAnswer[i].customerAnswers;
                    break;
                }
            }

            function findAnswer(item) {
                for (let i = 0; i < customerAnswerOnActiveBlock.length; i++) {
                    if (customerAnswerOnActiveBlock[i].question_id == item.id) {
                        if (item.type == 1) {
                            return customerAnswerOnActiveBlock[i].answer_id;
                        }
                        else {
                            return customerAnswerOnActiveBlock[i].value;
                        }
                    }
                }
            }

            function findAnswerCheckBox(item) {
                let mainData = [];

                customerAnswerOnActiveBlock.forEach(function (itemAnswer) {
                    if (itemAnswer.question_id == item.id) {
                        mainData.push(itemAnswer.answer_id);
                    }
                });

                return mainData;
            }

            mainQuestionInBlock.forEach(function (itemMainQuestion) {
                let mainData = {
                    answerData: []
                };

                if (itemMainQuestion.type == 0) {
                    mainData.mainData = findAnswerCheckBox(itemMainQuestion);
                }
                else {
                    mainData.mainData = findAnswer(itemMainQuestion);
                }


                if (mainData.mainData == undefined && itemMainQuestion.type == 0) {
                    mainData.mainData = [];
                }
                else if (itemMainQuestion.type == 1) {
                    itemMainQuestion.answers.forEach(function (itemAnswer, indexAnswer) {
                        mainData.answerData[indexAnswer] = {
                            childData: []
                        };
                        itemAnswer.child_questions.forEach(function (itemChildQuestion, indexChildQuestion) {
                            if (itemChildQuestion.type == 0) {
                                mainData.answerData[indexAnswer].childData[indexChildQuestion] = findAnswerCheckBox(itemChildQuestion);
                            }
                            else {
                                mainData.answerData[indexAnswer].childData[indexChildQuestion] = findAnswer(itemChildQuestion);
                            }

                            if (mainData.answerData[indexAnswer].childData[indexChildQuestion] == undefined && itemChildQuestion.type == 0) {
                                mainData.answerData[indexAnswer].childData[indexChildQuestion] = [];
                            }
                            else if (mainData.answerData[indexAnswer].childData[indexChildQuestion] == undefined) {
                                mainData.answerData[indexAnswer].childData.splice(indexChildQuestion, 1);
                            }

                        });
                    });
                }

                vm.data.push(mainData);

            });
        }

        function start() {
            if (mainQuestionInBlock.length == 0) {
                toNextBlock();
            }
            else {
                vm.questions = mainQuestionInBlock;
                vm.header = items.blocks[indexActiveBlock].name;
                if (indexActiveBlock > 0) {
                    vm.backSucces = true;
                }
                else {
                    vm.backSucces = false;
                }
            }
        }

        function next() {

            succesNext = true;

            console.log(vm.data, 'all answers in block');
            console.log(mainQuestionInBlock, 'all question in block');

            let dataForSend = [];

            if(vm.data.length > 0){
                vm.data.forEach(function (itemQuestion, indexQuestion) {

                    checkForFill(itemQuestion.mainData);

                    if(mainQuestionInBlock[indexQuestion].type == 1 || mainQuestionInBlock[indexQuestion].type == 0) {
                        let tmpObj = {};
                        tmpObj.question_id = mainQuestionInBlock[indexQuestion].id;

                        if(mainQuestionInBlock[indexQuestion].type == 1){
                            let id = serchAnswerId(mainQuestionInBlock[indexQuestion].id);

                            if(id != undefined){
                                tmpObj.id = id;
                            }
                        }

                        tmpObj.answer_id = itemQuestion.mainData;

                        dataForSend.push(tmpObj);

                        if(mainQuestionInBlock[indexQuestion].type == 1){
                            mainQuestionInBlock[indexQuestion].answers.forEach(function (itemAnswer, indexAnswer) {
                                if(itemAnswer.child_questions.length > 0){
                                    if(itemQuestion.mainData == itemAnswer.id){
                                        itemAnswer.child_questions.forEach(function (itemChildQuestion, indexChildQuestion) {
                                            if(typeof itemQuestion.answerData != 'undefined' && typeof itemQuestion.answerData[indexAnswer] != 'undefined'){
                                                let tmpObj = {};
                                                tmpObj.question_id = itemChildQuestion.id;

                                                // if(itemChildQuestion.type == 1){
                                                let id = serchAnswerId(itemChildQuestion.id);

                                                if(id != undefined){
                                                    tmpObj.id = id;
                                                }
                                                // }

                                                if(itemChildQuestion.type == 1 || itemChildQuestion.type == 0){
                                                    tmpObj.answer_id = itemQuestion.answerData[indexAnswer].childData[indexChildQuestion];
                                                }
                                                else {
                                                    tmpObj.value = itemQuestion.answerData[indexAnswer].childData[indexChildQuestion];
                                                }

                                                dataForSend.push(tmpObj);

                                                checkForFill(itemQuestion.answerData[indexAnswer].childData[indexChildQuestion]);
                                            }
                                            else {
                                                succesNext = false;
                                            }
                                        });
                                    }
                                    else {
                                        itemAnswer.child_questions.forEach(function (itemChildQuestion) {
                                            let id = serchAnswerId(itemChildQuestion.id);

                                            if(id != undefined){
                                                let tmpObj = {};
                                                tmpObj.delete = true;
                                                tmpObj.question_id = itemChildQuestion.id;

                                                // if(itemChildQuestion.type == 1){
                                                tmpObj.id = id;
                                                // }
                                                dataForSend.push(tmpObj);
                                            }
                                        })
                                    }
                                }
                            })
                        }


                    }
                    else {
                        let id = serchAnswerId(mainQuestionInBlock[indexQuestion].id);
                        let tmpObj = {};
                        tmpObj.value = itemQuestion.mainData;
                        tmpObj.question_id = mainQuestionInBlock[indexQuestion].id;

                        if(id != undefined){
                            tmpObj.id = id;
                        }

                        dataForSend.push(tmpObj);
                    }
                });
            }
            else {
                succesNext = false;
            }


            console.log('dataForSend', dataForSend);

            if(!succesNext){
                toastr.error('All fields should be complited');
            }
            else {
                passingQuestionService.sendCustomerAnswer(activeCustomers, dataForSend).then(function (res) {
                    console.log(res);
                    if(res.success){
                        toNextBlock();
                    }
                })
            }
        }

        function checkForFill(item) {
            if (typeof item == 'undefined' || item == '') {
                succesNext = false;
            }
        }

        function serchAnswerId(idQuestion) {
            for (let i = 0; i < customerAnswerOnActiveBlock.length; i++) {
                if (idQuestion == customerAnswerOnActiveBlock[i].question_id) {
                    return customerAnswerOnActiveBlock[i].id;
                }
            }
        }

        function back() {
            if (indexActiveBlock > 0) {
                indexActiveBlock--;
                generete();
                if (mainQuestionInBlock.length == 0) {
                    if (indexActiveBlock == 0) {
                        toNextBlock();
                    }
                    else {
                        back();
                    }
                }
                else {

                    let id = {
                        customer: activeCustomers,
                        survey: idActiveSurvey
                    };

                    passingQuestionService.getCustomerAnswer(id).then(function (res) {
                        if (res.success) {
                            customerAnswer = res.data.customerAnswers;
                            vm.data = [];
                            generete();
                            fill();
                            start();
                        }
                    });
                }
            }
        }


        let allChosenSurveys = surveyService.getSelectedSurveys();

        function toNextBlock() {
            console.log(items.blocks);
            if (items.blocks.length - 1 > indexActiveBlock) {
                indexActiveBlock++;
                generete();
                if (mainQuestionInBlock.length == 0) {
                    toNextBlock();
                }
                else {
                    vm.data = [];
                    fill();
                    start();
                }
            }
            else {
                let data = {
                    customer_id: activeCustomers,
                    survey_id: idActiveSurvey
                };
                passingQuestionService.createReport(data).then(function (res) {
                    if (res.success) {
                        if (allChosenSurveys.length > 1) {
                            allChosenSurveys.splice([0], 1);
                            survey.selectedSurveys(allChosenSurveys);
                            toastr.success('Has been completed', vm.activeSurveyName);
                            $state.reload();
                        } else {
                            customers.setfinishQuestionair(true);
                            $state.go('tab.user-management');
                            toastr.success('Completed');
                        }

                    }
                    else {
                        console.log('error');
                    }
                })
            }
        }

    }

})();
