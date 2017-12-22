;(function () {
    'use strict';

    angular.module('app')
        .controller('PassingQuestionController', PassingQuestionController);


    PassingQuestionController.$inject = ['passingQuestionService', '$state', 'customers', 'customerAnswer', 'oneSurveyItems', 'toastr'];

    function PassingQuestionController(passingQuestionService, $state, customers, customerAnswer , oneSurveyItems, toastr) {
        let vm = this;

        vm.next = next;
        vm.back = back;
        vm.backSucces = false;
        let succesNext = true;
        vm.data = [];

        console.log(customerAnswer, 'customaerAnswer');

        let indexActiveBlock;

        let items = oneSurveyItems;
        let idActiveSurvey = items.id;
        let activeCustomers = customers.getActiveCustomers();

        let mainQuestionInBlock;
        let customerAnswerOnActiveBlock;

        for(let j = 0; j < customerAnswer.length; j++){
            if(customerAnswer[j].customerAnswers.length == 0){
                for(let i = 0; i < items.blocks.length; i++){
                    if(customerAnswer[j].block_id == items.blocks[i].id){
                        indexActiveBlock = i;
                        break
                    }
                }
                break
            }
        }

        if(typeof indexActiveBlock == 'undefined'){
            indexActiveBlock = 0;
        }

        generete();
        fill();
        start();

        function generete() {
            mainQuestionInBlock = items.blocks[indexActiveBlock].questions;
            console.log('mainQuestionInBlock', mainQuestionInBlock);
        }

        function fill() {
            vm.data = [];
            customerAnswerOnActiveBlock = [];

            let idActiveBlock = items.blocks[indexActiveBlock].id;

            for(let i = 0; i < customerAnswer.length; i++){
                if(customerAnswer[i].block_id == idActiveBlock){
                    customerAnswerOnActiveBlock = customerAnswer[i].customerAnswers;
                    break
                }
            }

            function findAnswer(item) {
                for(let i = 0; i < customerAnswerOnActiveBlock.length; i++){
                    if(customerAnswerOnActiveBlock[i].question_id == item.id){
                        if(item.type == 1){
                            return customerAnswerOnActiveBlock[i].answer_id
                        }
                        else {
                            return customerAnswerOnActiveBlock[i].value
                        }
                    }
                }
            }

            mainQuestionInBlock.forEach(function (itemMainQuestion) {
                let mainData = {
                    mainData: findAnswer(itemMainQuestion),
                    answerData: []
                };

                if(itemMainQuestion.type == 1){
                    itemMainQuestion.answers.forEach(function (itemAnswer, indexAnswer) {
                        mainData.answerData[indexAnswer] = {
                            childData: []
                        };
                        itemAnswer.child_questions.forEach(function (itemChildQuestion, indexChildQuestion) {
                            mainData.answerData[indexAnswer].childData[indexChildQuestion] = findAnswer(itemChildQuestion);
                            if(mainData.answerData[indexAnswer].childData[indexChildQuestion] == undefined){
                                mainData.answerData[indexAnswer].childData.splice(indexChildQuestion, 1);
                            }
                        });
                    })
                }
                vm.data.push(mainData);

            });
        }

        function start() {
            if(mainQuestionInBlock.length == 0){
                toNextBlock();
            }
            else{
                vm.questions = mainQuestionInBlock;
                vm.header = items.blocks[indexActiveBlock].name;
                if(indexActiveBlock > 0){
                    vm.backSucces = true;
                }
                else{
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

                    if(mainQuestionInBlock[indexQuestion].type == 1) {
                        let tmpObj = {};

                        tmpObj.id = serchAnswerId(mainQuestionInBlock[indexQuestion].id);
                        tmpObj.answer_id = itemQuestion.mainData;

                        if(tmpObj.id == undefined){
                            tmpObj.question_id = mainQuestionInBlock[indexQuestion].id;
                        }
                        dataForSend.push(tmpObj);

                        mainQuestionInBlock[indexQuestion].answers.forEach(function (itemAnswer, indexAnswer) {
                            if(itemAnswer.child_questions.length > 0){
                                if(itemQuestion.mainData == itemAnswer.id){
                                    itemAnswer.child_questions.forEach(function (itemChildQuestion, indexChildQuestion) {
                                        if(typeof itemQuestion.answerData != 'undefined' && typeof itemQuestion.answerData[indexAnswer] != 'undefined'){
                                            let tmpObj = {};

                                            tmpObj.id = serchAnswerId(itemChildQuestion.id);

                                            if(itemChildQuestion.type == 1){
                                                tmpObj.answer_id = itemQuestion.answerData[indexAnswer].childData[indexChildQuestion];
                                            }
                                            else {
                                                tmpObj.value = itemQuestion.answerData[indexAnswer].childData[indexChildQuestion];
                                            }

                                            if(tmpObj.id == undefined){
                                                tmpObj.question_id = itemChildQuestion.id;
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
                                        let tmpObj = {
                                            id: serchAnswerId(itemChildQuestion.id),
                                            delete: true
                                        };

                                        if(tmpObj.id != undefined){
                                            dataForSend.push(tmpObj);
                                        }

                                    })
                                }
                            }
                        })
                    }
                    else {
                        let tmpObj = {};

                        tmpObj.id = serchAnswerId(mainQuestionInBlock[indexQuestion].id);
                        tmpObj.value = itemQuestion.mainData;

                        if(tmpObj.id == undefined){
                            tmpObj.question_id = mainQuestionInBlock[indexQuestion].id;
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

        function checkForFill (item){
            if(typeof item == 'undefined' || item == ''){
                succesNext = false;
            }
        }
        function serchAnswerId(idQuestion) {
            for (let i = 0; i < customerAnswerOnActiveBlock.length; i++){
                if(idQuestion == customerAnswerOnActiveBlock[i].question_id){
                    return customerAnswerOnActiveBlock[i].id
                }
            }
        }

        function back() {
            if(indexActiveBlock > 0){
                let id = {
                    customer: activeCustomers,
                    survey: idActiveSurvey
                };
                passingQuestionService.getCustomerAnswer(id).then(function (res) {
                    if(res.success){
                        customerAnswer = res.data.customerAnswers;
                        indexActiveBlock--;
                        vm.data = [];
                        generete();
                        fill();
                        start();
                    }
                    else{
                        console.log('error customer answer');
                    }
                });

            }
        }



        function toNextBlock() {
            if(items.blocks.length - 1 > indexActiveBlock){

                indexActiveBlock++;
                vm.data = [];
                generete();
                fill();
                start();
            }
            else{
                let data = {
                    customer_id: activeCustomers,
                    survey_id: idActiveSurvey
                };
                passingQuestionService.createReport(data).then(function (res) {
                    if(res.success){
                        $state.go('tab.user-management');
                        toastr.success('Completed');
                    }
                    else {
                        console.log('error');
                    }
                })
            }
        }
    }

})();
