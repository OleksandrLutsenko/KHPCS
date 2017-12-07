;(function () {
    'use strict';
    angular
        .module('app')
        .controller('AddQuestionController', AddQuestionController);

    AddQuestionController.$inject = ['$mdDialog', 'surveyQuestion', 'data'];

    function AddQuestionController($mdDialog, surveyQuestion, data) {
        let vm = this;

        vm.addAnsver = addAnsver;
        vm.deleteAnsver = deleteAnsver;
        vm.save = save;
        vm.cancel = cancel;


        let idQuestion = data.idQuestion;
        let indexQuestion = data.indexQuestion;
        let idBlock = data.idBlock;
        let items = angular.copy(data.items[indexQuestion]);


        if (typeof idQuestion != 'undefined') {
            vm.data = items;

            if (vm.data.type == 2) {
                if (vm.data.last == 1) {
                    vm.data.next_question = 'last';
                }
            }
            else {
                vm.data.answers.forEach(function (item) {
                    item.forDelete = false;

                    if (item.hasExtra == 1) {
                        item.hasExtra = true;
                    }
                    else {
                        item.hasExtra = false;
                    }

                    if (item.hasLast == 1) {
                        item.next_question = 'last';
                    }
                });
            }
        }
        else {
            vm.data = {
                answers: []
            }
        }

        function addAnsver() {
            if (vm.data.answers.length == 0 ||
                typeof vm.data.answers[vm.data.answers.length - 1].answer_text !== 'undefined'
                && vm.data.answers[vm.data.answers.length - 1].answer_text !== '') {

                vm.data.answers.push({});
            }
        }

        function deleteAnsver(id, indexAns) {
            if (typeof id != 'undefined') {
                vm.data.answers[indexAns].forDelete = true;
            }
            else {
                vm.data.answers.splice(indexAns, 1);
            }

        }

        function save() {
            surveyQuestion.createOrUpdateQuestion(idQuestion, indexQuestion, idBlock, vm.data, data.items).then(function (res) {
                if(vm.data.answers.length > 0 && res.type == 1){
                    surveyQuestion.createOrUpdateOrDeleteAnswer(vm.data.answers, data.items, indexQuestion, idQuestion);
                    cancel()
                }
                else {
                    cancel()
                }
            })
        }

        function cancel() {
            $mdDialog.cancel();
        }

    }

})();