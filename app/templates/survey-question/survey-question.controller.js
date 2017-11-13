;(function () {
    'use strict';
    angular.module('app')
        .controller('SurveyQuestionController', SurveyQuestionController);

    SurveyQuestionController.$inject = ['userService', '$state', 'survey', '$scope', '$mdDialog'];

    function SurveyQuestionController(userService, $state, survey, $scope, $mdDialog) {
        let vm = this;
        let idS = survey.getActineSurvey();
        let idB = survey.getActiveBlock();
        let indexBlock = idB.indexBlock;
        let idBlock = idB.id;

        $scope.$on('parent', function(event, data){
            indexBlock = data;
            vm.items = userService.getItems()[idS.indexSurvey].blocks[indexBlock].questions;
            idB = survey.getActiveBlock();
            idBlock = idB.id;
        });

        vm.items = userService.getItems()[idS.indexSurvey].blocks[indexBlock].questions;

        // function asdf(id, indexBlock) {
        //     survey.setActiveBlock(id, indexBlock)
        // }

        vm.showEdit = function (id, index) {

            $mdDialog.show({
                controller: EditController,
                controllerAs: 'vm',
                templateUrl: 'components/survey-question/edit/edit.html',
                clickOutsideToClose: true
            });

            function EditController($mdDialog) {
                let vs = this;

                if(typeof id != 'undefined') {
                    vs.data =  {
                        title: vm.items[index].title,
                        identifier: vm.items[index].identifier,
                        type: vm.items[index].type,
                        answers: vm.items[index].answers
                    };
                }

                vs.save = function () {
                    if(typeof id != 'undefined') {
                        userService.updateQuestion(id, vs.data).then(function (res) {
                            console.log(res);
                            if (res.success){
                                vm.items.splice(index, 1, res.data.question);
                                console.log(res.data, 'edit', vm.items);
                                userService.loadItems();
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
                                console.log(res, 'Create questions');
                                vm.items.push(res.data.question);
                            }
                            else {
                                console.log('error');
                            }
                            vs.cancel();
                        });
                    }
                    if(vs.data.type === 1){
                        if(typeof vs.ifYes != 'undefined'){
                            console.log(vs.ifYes, 'yeeeeeeeees');
                        }
                        if(typeof vs.ifNo != 'undefine'){
                            console.log(vs.ifNo, 'Nooooooooooo');
                        }

                    }
                };

                vs.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        };

        vm.deleteQuestionSM = function () {

            $mdDialog.show({
                controller: DeleteController,
                controllerAs: 'vm',
                templateUrl: 'components/survey-question/delete/delete.html',
                clickOutsideToClose: true
            });

            function DeleteController($mdDialog) {
                let vs = this;

                vs.deleteQuestionYes = function () {
                    alert('Здесь должна быть функция :/ survey-question.controller.js str=106');
                    $mdDialog.cancel();
                };

                vs.deleteQuestionNo = function () {
                    $mdDialog.cancel();
                };
            }
        };
    }
})();