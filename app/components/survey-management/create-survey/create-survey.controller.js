;(function () {
    'use strict';

    angular.module('app')
        .controller('CreateSurveyController', CreateSurveyController);


    CreateSurveyController.$inject = ['userService', '$state', '$mdDialog', 'survey', '$mdSidenav'];

    function CreateSurveyController(userService, $state, $mdDialog, survey, $mdSidenav) {
        let vm = this;

        vm.items = userService.getItems();
        // console.log('vm.items при старте = ');
        // console.log(vm.items);

        // vm.createSurvey = createSurvey;
        // function createSurvey() {
        //     let vs = this;
        //
        //     vs.createData = {
        //         name: name,
        //         status: "2"
        //     };
        //
        //     vs.save = function () {
        //         userService.createSurvey(vs.createData).then(function (res) {
        //             if (res.success) {
        //                 userService.loadItems().then(function () {
        //                     vm.items = userService.getItems();
        //                     $mdDialog.cancel();
        //                 });
        //             } else {
        //                 console.log('Save error');
        //             }
        //         });
        //     };
        //
        //     vs.cancel = function () {
        //         $mdDialog.cancel();
        //     };
        // }


        vm.saveSurvey = saveSurvey;
        function saveSurvey() {
            vm.createData = {
                name: name,
                status: "2"
            };


            if (typeof id != 'undefined') {
                userService.updateSurvey(vm.createData).then(function (res) {

                    if (res.success) {
                        console.log(res);
                        userService.loadItems().then(function () {
                            if (res.success) {
                                let tmpObj = {
                                    type: 'update'
                                };
                                $mdDialog.hide(tmpObj);
                            }
                            else {
                                cancel();
                            }

                            $mdDialog.cancel();

                        });
                    }
                    else {
                        console.log('error');
                    }
                });
            }
            else {
                console.log(vm.createData);
                userService.createSurvey(vm.createData).then(function (res) {
                    console.log(vm.createData);
                    console.log('create');
                        userService.loadItems().then(function () {
                            if (res.success) {

                                let tmpObj = {
                                    type: 'create'
                                };
                                $mdDialog.hide(tmpObj);
                            }
                            else {

                            }

                            $mdDialog.cancel();

                        });

                });
            }
        }

        //////////////////////////////////////////////////////////////////


        // vm.editSurvey = function (id, index) {
        //     console.log('Survey name: ' + vm.items[index].name);
        //     console.log('Survey id: ' + id);
        //     // console.log( vm.items[index]);
        //
        //     $mdDialog.show({
        //         controller: EditSurveyController,
        //         controllerAs: 'vm',
        //         templateUrl: 'components/survey-management/edit-survey/edit-survey.html',
        //         clickOutsideToClose: true
        //     });
        //
        //     function EditSurveyController($mdDialog) {
        //         let vs = this;
        //
        //         if (typeof id != 'undefined') {
        //             vs.data = {
        //                 name: vm.items[index].name,
        //                 description: vm.items[index].description
        //             };
        //         }
        //
        //         vs.save = function () {
        //             if (typeof id != 'undefined') {
        //                 userService.updateSurvey(id, vs.data).then(function (res) {
        //                     if (res.success) {
        //                         userService.loadItems().then(function () {
        //                             vm.items = userService.getItems();
        //                         });
        //                         // console.log('Заработало');
        //                     }
        //                     else {
        //                         console.log('error');
        //                     }
        //                     vs.cancel();
        //                 });
        //             }
        //         };
        //
        //         vs.cancel = function () {
        //             $mdDialog.cancel();
        //         };
        //     }
        //
        // };
        //
        // vm.deleteSurvey = function (surveyId) {
        //     $mdDialog.show({
        //         controller: deleteSurveyController,
        //         controllerAs: 'vm',
        //         templateUrl: 'components/deleteView/deleteView.html',
        //         clickOutsideToClose: true
        //     });
        //
        //     function deleteSurveyController($mdDialog) {
        //         let vs = this;
        //
        //         vs.delete = function () {
        //             console.log('Удален опросник с ID: ' + surveyId);
        //             userService.deleteSurvey(surveyId).then(function (res) {
        //                 if (res.success) {
        //                     console.log(res);
        //                     userService.loadItems().then(function () {
        //                         vm.items = userService.getItems();
        //                         $mdDialog.cancel();
        //                         // console.log(vm.items);
        //
        //                     });
        //                 }
        //                 else {
        //                     console.log('errorDelete');
        //                 }
        //             });
        //             $mdDialog.cancel();
        //         };
        //
        //         vs.cancel = function () {
        //             $mdDialog.cancel();
        //         };
        //     }
        // };

    }
})();
