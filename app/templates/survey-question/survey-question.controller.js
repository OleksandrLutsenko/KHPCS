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

        $scope.$on('parent', function(event, data){
            indexBlock = data;
            vm.items = userService.getItems()[idS.indexSurvey].blocks[indexBlock].questions;
        });

        vm.items = userService.getItems()[idS.indexSurvey].blocks[indexBlock].questions;

        // function asdf(id, indexBlock) {
        //     survey.setActiveBlock(id, indexBlock)
        // }

        vm.showEdit = function (id, index) {

            $mdDialog.show({
                controller: EditController,
                controllerAs: 'vm',
                templateUrl: 'templates/survey-question/edit.html',
                clickOutsideToClose: true
            });

            function EditController($mdDialog) {
                let vs = this;

                if(typeof id != 'undefined') {
                     vs.data =  {
                         title: vm.items[index].title,
                         identifier: vm.items[index].identifier,
                         type: vm.items[index].type
                    }
                }

                vs.save = function () {
                    if(typeof id != 'undefined') {
                        userService.updateQuestion(id, vs.data).then(function (res) {
                            console.log(res);
                            if (res.success){
                                vm.items.splice(index, 1, res.data.question);
                                console.log(res.data, 'sdfgs', vm.items);
                                userService.loadItems();
                            }
                            else {
                                console.log('error');
                            }
                            vs.cancel();
                        });
                    }
                    else {

                        userService.createQuestion(indexBlock, vs.data).then(function (res) {
                            if (res.success) {
                                console.log(res, 'succes');
                                vm.customers.push(res.data);
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