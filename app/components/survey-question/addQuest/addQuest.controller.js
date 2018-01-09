;(function () {
    'use strict';
    angular
        .module('app')
        .controller('AddQuestionController', AddQuestionController);

    AddQuestionController.$inject = ['$mdDialog', 'data', 'blockService', 'toastr'];

    function AddQuestionController($mdDialog, data, blockService, toastr) {
        let vm = this;

        vm.addAnsver = addAnsver;
        vm.deleteAnsver = deleteAnsver;
        vm.save = save;
        vm.cancel = cancel;

        let mainKey = data.mainKey;
        let answerKey = data.answerKey;
        let questionKey = data.questionKey;
        let idBlock = data.idBlock;
        let itemsOrig;


        if (typeof questionKey != 'undefined') {
            itemsOrig = data.items[mainKey].answers[answerKey].child_questions;
            vm.data = angular.copy(itemsOrig[questionKey]);
        }
        else if(typeof mainKey != 'undefined'){
            itemsOrig = data.items;
            vm.data = angular.copy(itemsOrig[mainKey]);
        }
        else {
            itemsOrig = data.items;
            vm.data = {
                answers: []
            }
        }

        function addAnsver() {
            if (vm.data.answers.length == 0 ||
                typeof vm.data.answers[vm.data.answers.length - 1].answer_text !== 'undefined'
                && vm.data.answers[vm.data.answers.length - 1].answer_text !== '') {

                let tmpObj = {
                  child_questions: []
                };

                vm.data.answers.push(tmpObj);
            }
        }

        function deleteAnsver(id, indexAns) {
            if (typeof id != 'undefined') {
                vm.data.answers[indexAns].delete = true;
                vm.data.answers[indexAns].child_questions = [];
            }
            else {
                vm.data.answers.splice(indexAns, 1);
            }

        }

        function save() {
            let succes = true;
            let couterLenght = 0;

            if(vm.data.type == 1 || vm.data.type == 0){
                vm.data.answers.forEach(function (item) {
                    if(!item.delete){
                        couterLenght++
                    }

                    if(typeof item.answer_text == 'undefined' || item.answer_text == ''){
                        succes = false
                    }
                });
            }
            else {
                succes = true;
            }

            if (vm.questForm.title.$invalid || vm.questForm.type.$invalid || !succes) {
                toastr.error('Please try again');
            }
            else if ((vm.data.type == 1 || vm.data.type == 0) && couterLenght < 2) {
                toastr.error('Answer lenght min 2');
            }
            else {
                if(typeof questionKey != 'undefined'){
                    // itemsOrig.splice(questionKey, 1, vm.data);

                    let dataForSend = [vm.data];

                    blockService.addBlockQuestion(idBlock, dataForSend).then(function (res) {
                        if(res.success){
                            itemsOrig.splice(questionKey, 1, vm.data);
                        }
                    })
                }
                else if(typeof mainKey != 'undefined') {
                    // itemsOrig.splice(mainKey, 1, vm.data);

                    let dataForSend = [vm.data];

                    blockService.addBlockQuestion(idBlock, dataForSend).then(function (res) {
                        if(res.success){
                            itemsOrig.splice(mainKey, 1, vm.data);
                        }
                    })
                }
                else {
                    // itemsOrig.push(vm.data);

                    let dataForSend = [vm.data];

                    blockService.addBlockQuestion(idBlock, dataForSend).then(function (res) {
                        if(res.success){
                            itemsOrig.push(vm.data);
                        }
                    })
                }
                $mdDialog.hide();
            }
        }

        function cancel() {
            $mdDialog.cancel();
        }

    }

})();