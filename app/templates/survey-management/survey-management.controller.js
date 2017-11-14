;(function () {
    'use strict';

    angular.module('app')
        .controller('SurveyManagementController', SurveyManagementController);


    SurveyManagementController.$inject = ['userService', '$state', '$mdDialog', 'survey'];

    function SurveyManagementController(userService, $state, $mdDialog, survey) {
        let vm = this;

        vm.setActineSurvey = setActineSurvey;

        vm.items = userService.getItems();

        function setActineSurvey(id, indexSurvey) {
            survey.setActineSurvey(id, indexSurvey);
        }

        ////////////////Qest list////////////////////////

        vm.jollo = 'hello QL';

        vm.QLOption = [
            'Active',
            'Deactive',
            'Archive',
            'Delete'
        ];


        vm.QLCurrentStatus = vm.QLOption[0];

        vm.announceClick = function(itemValue, id, index, itName, ev) {

            $mdDialog.show(
                $mdDialog.alert()
                // .title('You clicked!')
                    .textContent('Status changed to \"' + itemValue + '\"')
                    .ok('Ок')
            );


            vm.QLCurrentStatus = itemValue;
            if (itemValue === "Delete") {
                console.log(itemValue);
                console.log(id);
                console.log(index);


                userService.deleteSurvey(id).then(function (res) {
                    // if (res.success) {
                    //     vm.customers.splice(index, 1);
                    //     vs.cancel();
                    // }
                    // else {
                    //     console.log('errorDelete');
                    // }


                    // console.log(index);
                    console.log("Yeaahhhh!!!");
                });
            }
        };

        vm.showPrompt = function(ev) {
            let confirm = $mdDialog.prompt()
                .title('Please enter the name of the new questionnaire')
                .placeholder('Add name')
                .targetEvent(ev)
                .required(true)
                .cancel('Cancel')
                .ok('Save');

            $mdDialog.show(confirm).then(function(res) {
                let data = {
                    name: res,
                    description: 'test test',
                    status: "2"
                };
                userService.createSurvey(data).then(function (res) {

                    if (res.success) {
                        console.log(res, 'succes');
                        vm.items.push(res.data.survey);
                        console.log(res);
                    }
                    else {
                        console.log('error');
                    }


                });
            });

        };

        // let Snum = 0;
        //
        // vm.createBlock = createBlock;
        // vm.addQuestion = addQuestion;
        // vm.showEditSM = showEditSM;
        // userService.loadItems();
        // let items = userService.getItems();
        // vm.qestTab = items[Snum].blocks;
        //
        //
        // function createBlock() {
        //     userService.createBlock(Snum + 1, vm.data).then(function (res) {
        //         if (res.success){
        //             vm.qestTab.push(res.data.block);
        //         }
        //     });
        // }
        //
        // function addQuestion(id) {
        //     console.log(id)
        // }
        //
        // function showEditSM(data, id) {
        //     $mdDialog.show({
        //         controller: ShowEditSMCtrl,
        //         controllerAs: 'vm',
        //         templateUrl: 'templates/survey-management/edit.html',
        //         clickOutsideToClose: true
        //     });
        //     function ShowEditSMCtrl($mdDialog) {
        //         let vm = this;
        //         if(typeof data != 'undefined') {
        //             vm.editData = data;
        //         }
        //         console.log(id, '123');
        //
        //         vm.cancel = function () {
        //             $mdDialog.cancel();
        //         };
        //
        //         vm.save = function () {
        //             console.log('id123', id, 'data123', vm.editData);
        //             userService.createQuestion(id, vm.editData).then(function (res) {
        //                 console.log(res);
        //                 if (res.success){
        //                     // console.log(vm.qestTab);
        //                     // vm.qestTab.forEach(function (el) {
        //                     //     if(el.id === id){
        //                     //         console.log(indexOf(el))
        //                     //     }
        //                     // });
        //                     // vm.qestTab.block[0].push(res.data)
        //                 }
        //             });
        //         };
        //
        //         vm.inputCheck = function (inputValueNum) {
        //             if (inputValueNum === 1) {
        //                 return false;
        //             }
        //             else {
        //                 return true;
        //             }
        //         };
        //     }
        // }
        //
        // vm.cancel = function () {
        //             $mdDialog.cancel();
        // };
        //
        //
        // // vm.inputCheck = function (inputValueNum) {
        // //             if (inputValueNum === 1) {
        // //                 return false;
        // //             }
        // //             else {
        // //                 return true;
        // //             }
        // //         };
        //
        //
        // // vm.deleteQuestionSM = function (ev) {
        // //     $mdDialog.show({
        // //         controller: CancelController,
        // //         controllerAs: 'vm',
        // //         templateUrl: 'templates/survey-management/delete.html',
        // //         parent: angular.element(document.body),
        // //         targetEvent: ev,
        // //         clickOutsideToClose: true
        // //     });
        // //     function CancelController($mdDialog) {
        // //         let vm = this;
        // //         vm.cancel = function () {
        // //             $mdDialog.cancel();
        // //         };
        // //     }
        // // };
        //
        //
        // // vm.test = function () {
        // //     alert('Test');
        // // };
        // //
        // //
        // // angular.module('app').directive('questList', function() {
        // //     return {
        // //         restrict: 'E', // Е -деректива елементом А- атрибутом
        // //         templateUrl: 'components/survey-management/questionnaire-list.html', //Откуда брать директиву
        // //         // controller: QuestListCtrl,
        // //         // // controllerAs: 'vm'
        // //     };
        // // });
    }

})();
