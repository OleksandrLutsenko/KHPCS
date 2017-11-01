;(function () {
    'use strict';

    angular.module('app')
        .controller('SurveyManagementController', SurveyManagementController);


    SurveyManagementController.$inject = ['userService', '$state', '$mdDialog'];

    function SurveyManagementController(userService, $state, $mdDialog) {
        let vm = this;
        let Snum = 0;
        userService.loadItems();

        let items = userService.getItems();
        console.log(items, 'survay ctrl');

        vm.qestTab = items[Snum].blocks;
        console.log(items[Snum].blocks, 'Block survey');

        vm.addBlock = addBlock;
        vm.addQuestion = addQuestion;

        function addBlock() {
            console.log(vm.data);
            userService.addBlock(Snum + 1, vm.data).then(function (res) {
                if (res.success){
                    console.log(res);
                    vm.qestTab.push(res.data.block);
                }
            });
        }

        function addQuestion(id) {
            console.log(id)
        }

            vm.showEditSM = function (ev, question) {
                $mdDialog.show({
                    controller: ShowEditSMCtrl,
                    controllerAs: 'vm',
                    templateUrl: 'templates/survey-management/edit.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });

                function ShowEditSMCtrl($mdDialog) {
                    let vm = this;
                    vm.cancel = function () {
                        $mdDialog.cancel();
                    };
                    vm.question = question;
                    vm.inputCheck = function (inputValueNum) {
                        if (inputValueNum === 1) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    };
                }
            };




        vm.deleteQuestionSM = function (ev) {
            $mdDialog.show({
                controller: CancelController,
                controllerAs: 'vm',
                templateUrl: 'templates/survey-management/delete.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
            function CancelController($mdDialog) {
                let vm = this;
                vm.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        };


        vm.test = function () {
            alert('Test');
        };


        angular.module('app').directive('questList', function() {
            return {
                restrict: 'E', // Е -деректива елементом А- атрибутом
                templateUrl: 'components/survey-management/questionnaire-list.html', //Откуда брать директиву
                // controller: QuestListCtrl,
                // // controllerAs: 'vm'
            };
        });
    }

})();
