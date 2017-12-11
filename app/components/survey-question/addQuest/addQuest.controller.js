;(function () {
    'use strict';
    angular
        .module('app')
        .controller('AddQuestionController', AddQuestionController);

    AddQuestionController.$inject = ['$mdDialog', 'surveyQuestion', 'data' , 'toastr'];

    function AddQuestionController($mdDialog, surveyQuestion, data , toastr) {
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
            if (vm.dfg) {
                console.log('error');
                toastr.error('Please try again');
            }
            else {
                surveyQuestion.createOrUpdateQuestion(idQuestion, indexQuestion, idBlock, vm.data, data.items).then(function (res) {
                    if (vm.data.answers.length > 1 && res.type == 1) {
                        surveyQuestion.createOrUpdateOrDeleteAnswer(vm.data.answers, data.items, indexQuestion, idQuestion, res.hidden, res.idQuestion);
                        cancel();
                    }
                    else if(res.type == 2) {
                        cancel()
                    }
                    else {
                        toastr.success('Answer lenght min 2');
                    }
                })
            }
        }

        function cancel() {
            $mdDialog.cancel();
        }

    }

})();