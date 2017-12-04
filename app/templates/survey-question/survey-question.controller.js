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
        vm.deleteQuest = deleteQuest;

        $scope.$on('parent', function (event, data) {
            indexBlock = data;
            vm.items = userService.getItems()[idS.indexSurvey].blocks[indexBlock].questions;
            idB = survey.getActiveBlock();
            idBlock = idB.id;
        });

        vm.items = userService.getItems()[idS.indexSurvey].blocks[indexBlock].questions;

        function cancel() {
            $mdDialog.cancel();
        }


        function deleteQuest(id) {
            $mdDialog.show({
                controller: deleteQuestController,
                controllerAs: 'vm',
                locals: {
                    data: {
                        id: id,
                    }
                },
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            })
        }

        function deleteQuestController(data) {
            let vmd = this;

            let id = data.id;

            vmd.cancel = function () {
                $mdDialog.cancel();
            };

            vmd.delete = function () {
                userService.deleteQuestion(id).then(function (res) {
                    if (res.success) {
                        userService.loadItems().then(function () {
                            vm.items = userService.getItems()[idS.indexSurvey].blocks[indexBlock].questions;
                        });
                        cancel();
                    }
                    else {
                        console.log('error');
                    }
                })

            };

        }

        vm.showEdit = function (id, index) {
            $mdDialog.show({
                controller: EditController,
                controllerAs: 'vm',
                locals: {
                    data: {
                        id: id,
                        index: index
                    }
                },
                templateUrl: 'components/survey-question/addQuest/addQuest.html',
                clickOutsideToClose: true
            })
        };

        function EditController(data) {
            let vmd = this;

            vmd.cancel = cancel;

            let id = data.id;
            let index = data.index;

            if (typeof id !== 'undefined') {
                vmd.data = vm.items[index];

                if (vmd.data.type == 2) {
                    if (vmd.data.last == 1) {
                        vmd.data.next_question = 'last';
                    }
                }
                else {
                    vmd.data.answers.forEach(function (item) {
                        if (item.hasExtra === 1) {
                            item.hasExtra = true;
                        }
                        else if (item.hasExtra === 0) {
                            item.hasExtra = false;
                        }

                        if (item.hasLast == 1) {
                            item.next_question = 'last';
                        }
                    });
                }
            }
            else {
                vmd.data = {
                    answers: []
                }
            }

            console.log(vmd.data, 'pop ap data');

            vmd.addAnsver = function () {
                if (vmd.data.answers.length === 0 ||
                    typeof vmd.data.answers[vmd.data.answers.length - 1].answer_text !== 'undefined'
                    && vmd.data.answers[vmd.data.answers.length - 1].answer_text !== '') {

                    vmd.data.answers.push({});
                }
            };

            vmd.deleteAnsver = function (id, indexAns) {
                if (typeof id !== 'undefined') {
                    userService.deleteAnswer(id).then(function (res) {
                        console.log(res);
                        if (res.success) {
                            vmd.data.answers.splice(indexAns, 1);
                        }
                    })
                }
                else {
                    vmd.data.answers.splice(indexAns, 1);
                }

            };

            vmd.save = function () {
                if (typeof id !== 'undefined') {
                    let data = {
                        title: vmd.data.title,
                        identifier: vmd.data.identifier,
                        type: vmd.data.type,

                    };
                    if (data.type == 2) {
                        data.next_question = vmd.data.next_question;
                        if (data.next_question == 'last') {
                            data.last = 1;
                            delete data.next_question;
                        }
                        else {
                            data.last = 0
                        }
                    }
                    userService.updateQuestion(id, data).then(function (res) {
                        if (res.success) {
                            vm.items.splice(index, 1, res.data.question);
                            if (vmd.data.answers.length > 0 && vmd.data.type === 1) {

                                vmd.data.answers.forEach(function (item, indexAnswer) {
                                    let data = item;
                                    if (data.hasExtra === true) {
                                        data.hasExtra = 1;
                                    }
                                    else {
                                        data.hasExtra = 0;
                                    }
                                    if (data.next_question == 'last') {
                                        data.hasLast = 1;
                                        delete data.next_question;
                                    }
                                    else {
                                        data.hasLast = 0
                                    }
                                    if (typeof data.id !== 'undefined') {
                                        if (typeof data.answer_text !== 'undefined' && data.answer_text !== '') {
                                            userService.updateAnswer(data.id, data).then(function (res) {
                                                if (res.success) {
                                                    vm.items[index].answers.splice(indexAnswer, 1, res.data.answer);
                                                }
                                            });
                                        }
                                    }
                                    else {
                                        if (typeof data.answer_text !== 'undefined' && data.answer_text !== '') {
                                            userService.createAnswer(res.data.question.id, data).then(function (res) {
                                                if (res.success) {
                                                    vm.items[index].answers.push(res.data.answer);
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                        else {
                            console.log('error');
                        }
                        cancel();
                    });
                }
                else {
                    let data = {
                        title: vmd.data.title,
                        identifier: vmd.data.identifier,
                        type: vmd.data.type,
                    };
                    if (data.type === 2) {
                        data.next_question = vmd.data.next_question;
                        if (data.next_question == 'last') {
                            data.last = 1;
                            delete data.next_question;
                        }
                        else {
                            data.last = 0
                        }
                    }
                    userService.createQuestion(idBlock, data).then(function (res) {
                        if (res.success) {
                            vm.items.push(res.data.question);
                            if (vmd.data.answers.length > 0 && vmd.data.type === 1) {
                                vmd.data.answers.forEach(function (item) {
                                    let data = item;
                                    if (data.hasExtra === true) {
                                        data.hasExtra = 1;
                                    }
                                    else {
                                        data.hasExtra = 0;
                                    }
                                    if (data.next_question == 'last') {
                                        data.hasLast = 1;
                                        delete data.next_question;
                                    }
                                    else {
                                        data.hasLast = 0;
                                    }
                                    if (typeof data.answer_text !== 'undefined' && data.answer_text !== '') {
                                        userService.createAnswer(res.data.question.id, data).then(function (res) {
                                            if (res.success) {
                                                vm.items[vm.items.length - 1].answers.push(res.data.answer);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                        else {
                            console.log('error');
                        }
                        cancel();
                    });
                }
            };
        }
    }
})();