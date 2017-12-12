;(function () {
    'use strict';
    angular
        .module('app')
        .controller('AddQuestionController', AddQuestionController);

    AddQuestionController.$inject = ['$mdDialog', 'surveyQuestion', 'data' , 'toastr'];

    function AddQuestionController($mdDialog, surveyQuestion, data , toastr) {
        let vm = this;

        vm.addAnsver = addAnsver;

        vm.dropDown = data.dropDown;
        console.log(' vm.dropDown', vm.dropDown);

        vm.deleteAnsver = deleteAnsver;
        vm.save = save;
        vm.cancel = cancel;

        let idQuestion = data.idQuestion;
        let indexQuestion = data.indexQuestion;
        let idBlock = data.idBlock;
        let items = angular.copy(data.items[indexQuestion]);


        if (typeof idQuestion != 'undefined') {
            vm.data = items;

            if(vm.data.hidden == 1){
                vm.data.hidden = true;
            }
            else {
                vm.data.hidden = false;
            }
            
            if(vm.data.type == 1){
                vm.data.answers.forEach(function (item) {
                    item.forDelete = false;

                    if (item.hasHidden == 1) {
                        item.hasHidden = true;}
                    else {
                        item.hasHidden = false;
                    }
                })
            }
        }
        else {
            vm.data = {
                answers:  []
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
            if (vm.questForm.title.$invalid || vm.questForm.type.$invalid) {
                console.log('error');
                toastr.error('Please try again');

            }
            else if (vm.data.type == 1 && vm.data.answers.length < 2) {
                toastr.error('Answer lenght min 2');
            }
            else {
                surveyQuestion.createOrUpdateQuestion(idQuestion, indexQuestion, idBlock, vm.data, data.items).then(function (res) {
                    if (vm.data.answers.length > 1 && res.type == 1) {
                        surveyQuestion.createOrUpdateOrDeleteAnswer(vm.data.answers, data.items, indexQuestion, res.idQuestion, res.hidden, res.create);
                        $mdDialog.hide();
                    }
                    else if(res.type == 2) {
                        $mdDialog.hide()
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