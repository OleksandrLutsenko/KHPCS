;(function () {
    'use strict';
    angular.module('app')
        .controller('SurveyQuestionController', SurveyQuestionController);

    SurveyQuestionController.$inject = ['userService', 'survey', '$scope', '$mdDialog'];

    function SurveyQuestionController(userService, survey, $scope, $mdDialog) {
        let vm = this;
        let idS = survey.getActineSurvey();
        let idB = survey.getActiveBlock();
        let indexBlock = idB.indexBlock;
        let idBlock = idB.id;

        $scope.$on('parent', function (event, data) {
            indexBlock = data;
            vm.items = userService.getItems()[idS.indexSurvey].blocks[indexBlock].questions;
            idB = survey.getActiveBlock();
            idBlock = idB.id;
        });

        vm.items = userService.getItems()[idS.indexSurvey].blocks[indexBlock].questions;


        vm.showConfirm = function (ev, id, index) {
            $mdDialog.show({
                controller: deleteQuestController,
                controllerAs: 'vm',
                templateUrl: 'components/survey-question/deleteQuest/deleteQuest.html',
                clickOutsideToClose: true
            });

            function deleteQuestController($mdDialog) {
                let vs = this;

                vs.delete = function () {
                    if (typeof id != 'undefined') {
                        userService.deleteQuestion(id).then(function (res) {
                            if (res.success) {
                                vs.cancel();
                                vm.items.splice(index, 1);
                            }
                            else {
                                console.log('errorDelete');
                            }
                        });
                    }
                    else {
                        console.log('deleteError');
                    }
                };

                vs.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        };


        vm.showEdit = function (id, index) {

            $mdDialog.show({
                controller: EditController,
                controllerAs: 'vm',
                templateUrl: 'components/survey-question/addQuest/addQuest.html',
                clickOutsideToClose: true
            });

            function EditController($mdDialog) {
                let vs = this;


                if (typeof id != 'undefined') {
                    vs.data = {
                        title: vm.items[index].title,
                        identifier: vm.items[index].identifier,
                        type: vm.items[index].type,
                        answers: vm.items[index].answers
                    }
                }
                else {
                    vs.data = {
                        answers: []
                    }
                }

                vs.addAnsver = function () {
                    if (vs.data.answers.length === 0 || typeof vs.data.answers[vs.data.answers.length - 1].answer_text !== 'undefined'
                        && typeof vs.data.answers[vs.data.answers.length - 1].next_question !== 'undefined'
                        && vs.data.answers[vs.data.answers.length - 1].answer_text && vs.data.answers[vs.data.answers.length - 1].next_question !== '') {
                        vs.data.answers.push({});
                    }

                };

                vs.deleteAnsver = function (id, indexAns) {
                    if (typeof id !== 'undefined') {
                        userService.deleteAnswer(id).then(function (res) {
                            console.log(res);
                            if (res.success) {
                                vs.data.answers.splice(indexAns, 1);
                            }
                        })
                    }
                    else {
                        vs.data.answers.splice(indexAns, 1);
                    }

                };

                vs.saveQuest = function () {
                    if (typeof id != 'undefined') {
                        userService.updateQuestion(id, vs.data).then(function (res) {
                            if (res.success) {
                                vm.items.splice(index, 1, res.data.question);
                                if (vs.data.answers.length > 0 && vs.data.type === 1) {
                                    for (let i = 0; i < vs.data.answers.length; i++) {
                                        let data = vs.data.answers[i];
                                        if (typeof data.id !== 'undefined') {
                                            if (typeof data.answer_text !== 'undefined' && typeof data.next_question !== 'undefined' && data.answer_text !== '' && data.next_question !== '') {
                                                userService.updateAnswer(data.id, data).then(function (res) {
                                                    if (res.success) {
                                                        vm.items[index].answers.splice(i, 1, res.data.answer);
                                                    }
                                                });
                                            }
                                        }
                                        else {
                                            if (typeof data.answer_text !== 'undefined' && typeof data.next_question !== 'undefined' && data.answer_text !== '' && data.next_question !== '') {
                                                userService.createAnswer(res.data.question.id, data).then(function (res) {
                                                    if (res.success) {
                                                        vm.items[index].answers.push(res.data.answer);
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                console.log('error');
                            }
                            vs.cancel();
                        });
                    }
                    else {
                        userService.createQuestion(idBlock, vs.data).then(function (res) {
                            if (res.success) {
                                vm.items.push(res.data.question);
                                if (vs.data.answers.length > 0) {
                                    for (let i = 0; i < vs.data.answers.length; i++) {
                                        let data = {
                                            answer_text: vs.data.answers[i].answer_text,
                                            next_question: vs.data.answers[i].next_question
                                        };
                                        if (typeof data.answer_text !== 'undefined' && typeof data.next_question !== 'undefined' && data.answer_text !== '' && data.next_question !== '') {
                                            userService.createAnswer(res.data.question.id, data).then(function (res) {
                                                if (res.success) {
                                                    vm.items[vm.items.length - 1].answers.push(res.data.answer);
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                            else {
                                console.log('error');
                            }
                            vs.cancel();
                        });
                    }
                };
                vs.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        };
    }
})();