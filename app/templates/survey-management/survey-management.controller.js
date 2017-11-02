;(function () {
    'use strict';

    angular.module('app')
        .controller('SurveyManagementController', SurveyManagementController);


    SurveyManagementController.$inject = ['userService', '$state', '$mdDialog', 'survey'];

    function SurveyManagementController(userService, $state, $mdDialog, survey) {
        let vm = this;

        let Snum = 0;

        vm.createBlock = createBlock;
        vm.addQuestion = addQuestion;
        vm.showEditSM = showEditSM;
        userService.loadItems();
        let items = userService.getItems();
        vm.qestTab = items[Snum].blocks;


        function createBlock() {
            userService.createBlock(Snum + 1, vm.data).then(function (res) {
                if (res.success){
                    vm.qestTab.push(res.data.block);
                }
            });
        }

        function addQuestion(id) {
            console.log(id)
        }

        function showEditSM(data, id) {
            $mdDialog.show({
                controller: ShowEditSMCtrl,
                controllerAs: 'vm',
                templateUrl: 'templates/survey-management/edit.html',
                clickOutsideToClose: true
            });
            function ShowEditSMCtrl($mdDialog) {
                let vm = this;
                if(typeof data != 'undefined') {
                    vm.editData = data;
                }
                console.log(id, '123');

                vm.cancel = function () {
                    $mdDialog.cancel();
                };

                vm.save = function () {
                    console.log('id123', id, 'data123', vm.editData);
                    userService.createQuestion(id, vm.editData).then(function (res) {
                        console.log(res);
                        if (res.success){
                            // console.log(vm.qestTab);
                            // vm.qestTab.forEach(function (el) {
                            //     if(el.id === id){
                            //         console.log(indexOf(el))
                            //     }
                            // });
                            // vm.qestTab.block[0].push(res.data)
                        }
                    });
                };

                vm.inputCheck = function (inputValueNum) {
                    if (inputValueNum === 1) {
                        return false;
                    }
                    else {
                        return true;
                    }
                };
            }
        }

        vm.cancel = function () {
                    $mdDialog.cancel();
        };
        

        // vm.inputCheck = function (inputValueNum) {
        //             if (inputValueNum === 1) {
        //                 return false;
        //             }
        //             else {
        //                 return true;
        //             }
        //         };


        // vm.deleteQuestionSM = function (ev) {
        //     $mdDialog.show({
        //         controller: CancelController,
        //         controllerAs: 'vm',
        //         templateUrl: 'templates/survey-management/delete.html',
        //         parent: angular.element(document.body),
        //         targetEvent: ev,
        //         clickOutsideToClose: true
        //     });
        //     function CancelController($mdDialog) {
        //         let vm = this;
        //         vm.cancel = function () {
        //             $mdDialog.cancel();
        //         };
        //     }
        // };


        // vm.test = function () {
        //     alert('Test');
        // };
        //
        //
        // angular.module('app').directive('questList', function() {
        //     return {
        //         restrict: 'E', // Е -деректива елементом А- атрибутом
        //         templateUrl: 'components/survey-management/questionnaire-list.html', //Откуда брать директиву
        //         // controller: QuestListCtrl,
        //         // // controllerAs: 'vm'
        //     };
        // });
    }

})();
