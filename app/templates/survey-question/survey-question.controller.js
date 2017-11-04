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
                    // vs.data =  {
                    //     name: vm.customers[index].name,
                    //     surname: vm.customers[index].surname,
                    //     classification: vm.customers[index].classification
                    // }
                }

                vs.saved = function () {
                    console.log(id, vs.data);
                    if(typeof id != 'undefined') {
                        userService.updateCustomers(id, vs.data).then(function (res) {
                            if (res.success) {
                                console.log(res, 'succes');
                                vm.customers.splice(index, 1, res.data);
                            }
                            else {
                                console.log('error');
                            }
                            vs.cancel();
                        });
                    }
                    else {
                        userService.createCustomers(vs.data).then(function (res) {
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