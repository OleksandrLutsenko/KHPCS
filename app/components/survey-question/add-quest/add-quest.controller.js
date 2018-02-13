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
        let questionsArr = data.items;
        vm.questions = questionsArr;
        let identifierDefault;
        if (mainKey !== undefined) {
            identifierDefault = data.items[mainKey].identifier;
            console.log(identifierDefault);
        }
        console.log(data.items[mainKey]);
        let itemsOrig;
        let loopingValid;
        let identifierValid;

        console.log('questions = ', questionsArr);



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
            };
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
                        couterLenght++;
                    }

                    if(typeof item.answer_text == 'undefined' || item.answer_text == ''){
                        succes = false;
                    }
                });
            }
            else {
                succes = true;
            }

            if (vm.questForm.$invalid || !succes) {
            }
            else if ((vm.data.type == 1 || vm.data.type == 0) && couterLenght < 2) {
                toastr.error('Answer length min 2');
            }
            else {
                if(typeof questionKey != 'undefined'){

                    if (vm.data.type == 1 || vm.data.type == 0){
                        vm.data.answers.forEach(function (itemAnswer, indexAnswer) {
                            itemAnswer.order_number = indexAnswer;
                            console.log(itemAnswer);
                        });
                    }

                    let dataForSend = [vm.data];
                    loopingTest(vm.data);
                    console.log('?');


                    blockService.addBlockQuestion(idBlock, dataForSend).then(function (res) {
                        if(res.success){
                            itemsOrig.splice(questionKey, 1, vm.data);
                        }
                    });
                }
                else if(typeof mainKey != 'undefined') {

                    if (vm.data.type == 1 || vm.data.type == 0){
                        vm.data.answers.forEach(function (itemAnswer, indexAnswer) {
                            itemAnswer.order_number = indexAnswer;
                        });
                    }

                    let dataForSend = [vm.data];
                    console.log('vm.data = ', vm.data);
                    loopingTest(vm.data);

                    let tmpData = angular.copy(vm.data);
                    tmpData.editType = 'edit';
                    identifierValidFunc(tmpData);

                    if (loopingValid === true && identifierValid === true) {
                        console.log(dataForSend);
                        blockService.addBlockQuestion(idBlock, dataForSend).then(function (res) {
                            if(res.success){
                                console.log('edit');
                                itemsOrig.splice(mainKey, 1, vm.data);
                            }
                        });
                        $mdDialog.hide();
                    }
                }
                else {
                    vm.data.child_order_number = null;

                    if(itemsOrig.length == 0){
                        vm.data.order_number = 0;
                    }
                    else {
                        vm.data.order_number = itemsOrig[itemsOrig.length - 1].order_number + 1;
                    }

                    if (vm.data.type == 1 || vm.data.type == 0){
                        vm.data.answers.forEach(function (itemAnswer, indexAnswer) {
                            itemAnswer.order_number = indexAnswer;
                        });
                    }
                    vm.data.mandatory = 1;
                    let dataForSend = [vm.data];
                    loopingTest(vm.data);

                    let tmpData = vm.data;
                    // tmpData.editType = 'add';
                    identifierValidFunc(tmpData);

                    if (loopingValid === true && identifierValid === true) {

                        console.log(dataForSend);

                        blockService.addBlockQuestion(idBlock, dataForSend).then(function (res) {
                            if(res.success){
                                itemsOrig.push(res.data.questions[0]);

                            }
                        });
                        $mdDialog.hide();
                    }
                }
                // $mdDialog.hide();
            }
        }

        vm.changeNextQuest = function(quest, answer ) {
            let question = vm.data;

            if (quest === undefined) {
                question.next_question = null;
                vm.data = question;

                if (answer !== undefined) {
                    answer.next_question = null;
                    vm.data = question;
                }
                console.log(vm.data);
                blockService.addBlockQuestion(idBlock, [vm.data]);

            } else if (question.type === 1) {
                angular.forEach(question.answers, function (ans) {
                    console.log(answer);
                    if (answer.id === ans.id) {
                        vm.answerOldValue = answer.next_question;
                        answer.next_question = quest.identifier;
                        vm.data = question;
                    }
                });

                loopingTest(question);

                if (loopingValid === false) {
                    console.log(vm.data);
                    return vm.data;
                } else {
                    blockService.addBlockQuestion(idBlock, [vm.data]);
                }

            } else {
                vm.data = question;
                vm.oldValue = vm.data.next_question;
                vm.data.next_question = quest.identifier;

                loopingTest(question);
                if (loopingValid === false) {
                    console.log('false');
                    console.log(vm.data);
                    return vm.data;
                } else {
                    blockService.addBlockQuestion(idBlock, [vm.data]);
                }
            }
        }

        function loopingTest(Obj) {
            let tmpArr = questionsArr;
            let tmpIdentifier = Obj.identifier;
            let chain = [Obj];
            let tmpValid = true;

            console.log('tmpArr', tmpArr);
            console.log('Obj', Obj);

            for (let i in tmpArr) {
                for (let index in tmpArr) {
                    if (tmpArr[index].type === 1) {
                        for (let radioIndex in tmpArr[index].answers) {
                            // console.log(tmpArr[index].answers[radioIndex].next_question);
                            // console.log(tmpIdentifier);
                            if (tmpArr[index].answers[radioIndex].next_question === tmpIdentifier) {
                                tmpIdentifier = tmpArr[index].identifier;
                                chain.push(tmpArr[index]);
                            }
                        }
                    } else {
                        // console.log(tmpArr[index].next_question);
                        // console.log(tmpIdentifier);
                        if (tmpArr[index].next_question === tmpIdentifier) {
                            tmpIdentifier = tmpArr[index].identifier;
                            chain.push(tmpArr[index]);
                        }
                    }

                }
            }
            console.log('chain', chain);
            console.log('Obj ', Obj);

            if (Obj.type === 1) {
                // console.log('It`s radio!');
                for (let answerIndex in Obj.answers) {
                    for (let chainIndex in chain) {

                        // console.log(chain[chainIndex].identifier);
                        // console.log(Obj.answers[answerIndex].next_question);
                        // console.log("-------------------------------------------");

                        // if (chain[chainIndex].title === Obj.answers[answerIndex].next_question) {
                        if (chain[chainIndex].identifier === Obj.answers[answerIndex].next_question) {
                            tmpValid = false;
                            console.log('You create loop!');
                            toastr.error('You create loop1!');
                            Obj.answers[answerIndex].next_question = vm.answerOldValue;
                            break;
                        }
                    }
                    loopingValid = tmpValid;
                }
            } else {
                // console.log('It`s no radio!');
                for (let chainIndex in chain) {
                    if (chain[chainIndex].identifier === Obj.next_question) {
                        tmpValid = false;
                        console.log('You create loop!');
                        toastr.error('You create loop2!');
                        Obj.next_question = vm.oldValue;
                        break;
                    }
                }
                loopingValid = tmpValid;
            }
            console.log('loopingValid = ', loopingValid);
        }

        function identifierValidFunc(Obj) {
            let tmpValid = true;

            if (Obj.editType === 'add') {
                for (let index in questionsArr) {
                    if (questionsArr[index].identifier === vm.data.identifier) {
                        tmpValid = false;
                        console.log(questionsArr[index].identifier + ' = ' + vm.data.identifier);
                        toastr.error('Identifier already exist');
                    }
                }
                identifierValid = tmpValid;
            } else {
                for(let index in questionsArr) {
                    if (Obj.identifier !== identifierDefault) {
                        if (questionsArr[index].identifier === vm.data.identifier) {
                            tmpValid = false;
                            console.log(questionsArr[index].identifier + ' = ' + vm.data.identifier);
                            toastr.error('Identifier already exist');
                        }
                    }
                }
            }
            identifierValid = tmpValid;
            console.log('identifierValid = ', identifierValid)
        }

        function cancel() {
            $mdDialog.cancel();
        }

    }

})();