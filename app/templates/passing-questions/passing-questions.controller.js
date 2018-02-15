;(function () {
    'use strict';

    angular.module('app')
        .controller('PassingQuestionController', PassingQuestionController);


    PassingQuestionController.$inject = ['$scope', 'countries', 'passingQuestionService', '$state', 'customers', 'customerAnswer', 'oneSurveyItems', 'toastr', 'tabsService', 'surveyService', 'survey'];

    function PassingQuestionController($scope, countries, passingQuestionService, $state, customers, customerAnswer, oneSurveyItems, toastr, tabsService, surveyService, survey) {
        let vm = this;
        $scope.$emit('changeTab', 'page6');

        vm.toggle = toggle;
        vm.exists = exists;
        vm.next = next;
        vm.back = back;
        vm.checkRadioTreeExample = checkRadioTreeExample;
        vm.backSucces = false;
        let succesNext = true;
        vm.data = [];
        vm.activeSurveyName = oneSurveyItems.name;
        vm.emptySurvey = false;
        // console.log(customerAnswer, 'customerAnswer');

        let indexActiveBlock;

        let items = oneSurveyItems;
        // console.log(items);
        let idActiveSurvey = items.id;
        let activeCustomers = customers.getActiveCustomers();

        let mainQuestionInBlock;
        let customerAnswerOnActiveBlock;

        let radioId;
        let lastRadioAnswerId;

        if (customerAnswer != undefined) {
            for (let j = 0; j < customerAnswer.length; j++) {
                if (customerAnswer[j].customerAnswers.length == 0) {
                    for (let i = 0; i < items.blocks.length; i++) {
                        if (customerAnswer[j].block_id == items.blocks[i].id && items.blocks[i].questions.length > 0) {
                            indexActiveBlock = i;
                            break;
                        }
                    }
                    break;
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
            vm.emptySurvey = true;
            // toastr.error('No block in active survey');
        }

        vm.toUserManagement = function () {
            $state.go('tab.user-management');
        };

        vm.cities = countries;
        vm.querySearch = querySearch;

        function querySearch(query) {
            return query ? vm.cities.filter(createFilterFor(query)) : vm.cities;
        }

        function createFilterFor(query) {

            let lowercaseQuery = query.toLowerCase();

            return function filterFn(city) {
                city = city.toLowerCase();
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
            if (item !== undefined && item !== null && list !== undefined && list !== null) {
                return list.indexOf(item) > -1;
            }
        }

        function generete() {
            mainQuestionInBlock = items.blocks[indexActiveBlock].questions;
            console.log('mainQuestionInBlock', mainQuestionInBlock);

            if (mainQuestionInBlock.length) {
                vm.questions = angular.copy([mainQuestionInBlock[0]]);
                chain(vm.questions[0].next_question);
            } else {
                console.log('No questions in block');
                vm.questions = [];
                vm.endOfChain = true;

            }
        }

        function fill(index) {
            if (!mainQuestionInBlock.length) {
                return false;
            }
            if (index === undefined) {
                vm.data = [];
                customerAnswerOnActiveBlock = [];
            } else {
                vm.data.splice(index, vm.data.length);
                // if (customerAnswerOnActiveBlock !== undefined) {
                //     customerAnswerOnActiveBlock.splice(index, vm.data.length);
                // }
            }

            let idActiveBlock = items.blocks[indexActiveBlock].id;

            for (let i = 0; i < customerAnswer.length; i++) {
                if (customerAnswer[i].block_id == idActiveBlock) {
                    customerAnswerOnActiveBlock = customerAnswer[i].customerAnswers;
                    console.log('customerAnswerOnActiveBlock = ', customerAnswerOnActiveBlock);
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

            vm.questions.forEach(function (itemMainQuestion, i) {
                if (index === undefined) {
                    AnswersBuildFunc();
                } else if (index <= i) {
                    AnswersBuildFunc();
                }

                function AnswersBuildFunc() {
                    let mainData = {
                        answerData: []
                    };

                    if (itemMainQuestion.type == 0) {
                        mainData.mainData = findAnswerCheckBox(itemMainQuestion);
                        // console.log(mainData.mainData);
                    }
                    else {
                        mainData.mainData = findAnswer(itemMainQuestion);
                        // console.log(mainData.mainData);
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
                    // console.log('vm.data = ', vm.data);
                }
            });
            if (vm.questions[vm.questions.length - 1].type === 1) {
                // console.log('Последний Радио');
                for (let indexAnswer in vm.questions[vm.questions.length - 1].answers) {
                    if (vm.questions[vm.questions.length - 1].answers[indexAnswer].id === vm.data[vm.data.length - 1].mainData) {
                        let tmpRadioAnswerId = vm.questions[vm.questions.length - 1].answers[indexAnswer].id;

                        if (lastRadioAnswerId !== tmpRadioAnswerId) {
                            let radioObj;
                            let selectedRadioIdentifier = vm.questions[vm.questions.length - 1].identifier;
                            let selectedRadioId = vm.data[vm.data.length - 1].mainData;
                            let indexInArr = vm.questions.length - 1;

                            for (let indexQuestion in vm.questions[vm.questions.length - 1].answers) {
                                if (vm.questions[vm.questions.length - 1].answers[indexQuestion].id === selectedRadioId) {
                                    radioObj = vm.questions[vm.questions.length - 1].answers[indexQuestion];
                                }
                            }

                            // console.log('radioObj = ', radioObj);
                            // console.log('selectedRadioIdentifier = ', selectedRadioIdentifier);
                            // console.log('index = ', indexInArr);

                            lastRadioAnswerId = tmpRadioAnswerId;
                            checkRadioTreeExample(radioObj, selectedRadioIdentifier, indexInArr);
                            break;
                        }
                    }
                }
            }
        }

        function start() {
            vm.header = items.blocks[indexActiveBlock].name;

            if (indexActiveBlock > 0) {
                vm.backSucces = true;
            }
            else {
                vm.backSucces = false;
            }
        }

        function next() {
            succesNext = true;

            // console.log(vm.data, 'all answers in block');
            // console.log(mainQuestionInBlock, 'all question in block');
            // console.log(vm.questions, 'all question in chain');

            let dataForSend = [];

            if (vm.data.length > 0) {
                vm.data.forEach(function (itemQuestion, indexQuestion) {
                    console.log('vm.data', vm.data);

                    checkForFill(itemQuestion.mainData);

                    if (vm.questions[indexQuestion].type == 1 || vm.questions[indexQuestion].type == 0) {
                        let tmpObj = {};
                        tmpObj.question_id = vm.questions[indexQuestion].id;

                        if (vm.questions[indexQuestion].type == 1) {
                            let id = serchAnswerId(vm.questions[indexQuestion].id);

                            if (id != undefined) {
                                tmpObj.id = id;
                            }
                        }

                        tmpObj.answer_id = itemQuestion.mainData;

                        dataForSend.push(tmpObj);

                        if (vm.questions[indexQuestion].type == 1) {
                            vm.questions[indexQuestion].answers.forEach(function (itemAnswer, indexAnswer) {
                                if (itemAnswer.child_questions.length > 0) {
                                    if (itemQuestion.mainData == itemAnswer.id) {
                                        itemAnswer.child_questions.forEach(function (itemChildQuestion, indexChildQuestion) {
                                            if (typeof itemQuestion.answerData != 'undefined' && typeof itemQuestion.answerData[indexAnswer] != 'undefined') {
                                                let tmpObj = {};
                                                tmpObj.question_id = itemChildQuestion.id;

                                                // if(itemChildQuestion.type == 1){
                                                let id = serchAnswerId(itemChildQuestion.id);

                                                if (id != undefined) {
                                                    tmpObj.id = id;
                                                }
                                                // }

                                                if (itemChildQuestion.type == 1 || itemChildQuestion.type == 0) {
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

                                            if (id != undefined) {
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
                        let id = serchAnswerId(vm.questions[indexQuestion].id);
                        let tmpObj = {};
                        tmpObj.value = itemQuestion.mainData;
                        tmpObj.question_id = vm.questions[indexQuestion].id;

                        if (id != undefined) {
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

            angular.forEach(vm.questions, function (question) {
                if (question.type === 0 && question.mandatory === 1) {
                    angular.forEach(dataForSend, function (dataForSend) {
                        if (dataForSend.question_id === question.id) {
                            if (dataForSend.answer_id.length < 1) {
                                vm.questionForm.$invalid = true;
                            }
                        }
                    })
                }
            });

            if (vm.questionForm.$invalid) {
                toastr.error('All fields must be completed correctly');
            } else {
                if (dataForSend.length) {

                    dataForSend = dataForSend.filter(function (obj) {
                        if (obj.answer_id) {
                            console.log(dataForSend);
                            if (Array.isArray(obj.answer_id)) {

                                if (obj.answer_id.length === 0) {
                                } else {
                                    return obj;
                                }
                            } else {
                                return obj;
                            }
                        } else {
                            return obj;
                        }
                    });

                    // console.log('dataForSend', dataForSend);
                    if (dataForSend.length) {
                        passingQuestionService.sendCustomerAnswer(activeCustomers, dataForSend).then(function (res) {
                            console.log(res);
                            if (res.success) {
                                toNextBlock();
                            }
                        })
                    } else {
                        toNextBlock();
                    }
                } else {
                    toNextBlock();
                }
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

                vm.data = [];
                if (vm.questions.length) {
                    vm.endOfChain = false;
                } else {
                    vm.endOfChain = true;
                }
                fill();
                start();
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

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        function chain(nextQuestion, questionIdentifier, click) {
            let questionsArr = mainQuestionInBlock;
            let tmpNextQuestion = nextQuestion;

            if (vm.questions.length > 1) {
                if (nextQuestion === null) {
                    for (let index = 0; index < vm.questions.length; index++) {
                        if (questionIdentifier === vm.questions[index].identifier) {
                            vm.questions.splice(index + 1, vm.questions.length);
                            // console.log(vm.questions);
                            chainBuilder(nextQuestion, click);
                        }
                    }
                } else {
                    if (vm.questions[vm.questions.length - 1].identifier !== nextQuestion.identifier) {
                        for (let index = 0; index < vm.questions.length; index++) {
                            if (questionIdentifier === vm.questions[index].identifier) {
                                vm.questions.splice(index + 1, vm.questions.length);
                                // console.log(vm.questions);
                                chainBuilder(nextQuestion, click);
                            }
                        }
                    }
                }

            } else {
                chainBuilder(nextQuestion, click);
            }

            function chainBuilder(nextQuestClick, click) {
                console.log(click);
                for (let x in questionsArr) {
                    if (nextQuestClick === null && vm.questions[0].type !== 1) {
                        vm.endOfChain = true;
                        break;
                    }
                    if (nextQuestClick === null && vm.questions[0].type === 1 && questionsArr.length === 1 && click === true) {
                        vm.endOfChain = true;
                        break;
                    }
                    if (tmpNextQuestion === null && vm.questions[0].type !== 1) {
                        break;
                    }
                    for (let i in questionsArr) {
                        if (tmpNextQuestion === questionsArr[i].identifier && questionsArr[i].type !== 1) {
                            vm.questions.push(questionsArr[i]);
                            if (questionsArr[i].next_question === null) {
                                tmpNextQuestion = null;
                                vm.endOfChain = true;  // Переменная для показа кнопки [Next] в passing-questions
                                break;

                            } else {
                                tmpNextQuestion = questionsArr[i].next_question;
                            }
                        } else if (tmpNextQuestion === questionsArr[i].identifier && questionsArr[i].type === 1) {
                            vm.questions.push(questionsArr[i]);
                            tmpNextQuestion = null;
                            vm.endOfChain = false;
                            break;
                        }
                    }
                }
                console.log('vm.questions', vm.questions);
            }
        }

        function checkRadioTreeExample(radio, parentIdentifier, index, manualInput) {
            if (manualInput === true) {
                radioId = radio.id;
                let tmpStatus = false;

                for (let chainIndex in vm.questions) {
                    if (vm.questions[chainIndex].type === 1) {
                        if (radioId == vm.data[chainIndex].mainData) {
                            // console.log('Already in use');
                            tmpStatus = true;
                            break;
                        }
                    }
                }

                if (tmpStatus === false) {
                    chain(radio.next_question, parentIdentifier, manualInput);
                    fill(index);
                }
            } else {
                radioId = radio.id;

                chain(radio.next_question, parentIdentifier);
                fill(index);
            }
        }

    }

})();
