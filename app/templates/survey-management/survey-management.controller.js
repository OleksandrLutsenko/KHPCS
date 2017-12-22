;(function () {
    'use strict';

    angular.module('app')
        .controller('SurveyManagementController', SurveyManagementController);


    SurveyManagementController.$inject = ['userService', '$mdDialog', 'survey', '$mdSidenav' , 'toastr' , 'tabsService'];

    function SurveyManagementController(userService, $mdDialog, survey, $mdSidenav , toastr, tabsService) {
        let vm = this;
        tabsService.startTab('page2');

        vm.setActineSurvey = setActineSurvey;

        vm.items = userService.getItems();

        userService.loadSurveyOnly().then(function (res) {
           console.log(res);
        });

        function setActineSurvey(id, indexSurvey) {
            survey.setActineSurvey(id, indexSurvey);
        }

        vm.activeSurvey = function (id, index) {
            userService.changeStatusSurvey(id).then(function (res) {
                if (res.success) {
                    userService.loadItems().then(function () {
                        vm.items = userService.getItems();
                    });
                } else {
                    console.log('Change Status Survey error');
                }

            });
        };


        vm.archiveSurvey = function (id, eddOrExtract) {
            userService.archiveStatusSurvey(id).then(function (res) {
                if (res.success) {
                    toastr.success('Questionnaire was ' + eddOrExtract);
                    userService.loadItems().then(function () {
                        vm.items = userService.getItems();
                        archiveEmpty();
                    });
                } else {
                    console.log('Archive Status Survey error');
                }

            });
        };

        function archiveEmpty() {
            vm.ArchiveIsEmpti = true;
            for (var item in vm.items) {
                if (vm.items[item].status === 0) {
                    vm.ArchiveIsEmpti = false;
                    console.log('vm.ArchiveIsEmpti = ' + vm.ArchiveIsEmpti);
                    break;
                }
            }

        }
        archiveEmpty();


        vm.toggleOpenArchive = buildToggler('right');
        function buildToggler(componentId) {
            return function () {
                $mdSidenav(componentId).toggle();
            };
        }

        vm.closeArchiveButton = function () {
            $mdSidenav('right').close();
        };


        vm.deleteSurvey = deleteSurvey;

        function deleteSurvey(surveyId) {
            $mdDialog.show({
                controller: 'DeleteViewController',
                controllerAs: 'vm',
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            }).then(function () {
                userService.deleteSurvey(surveyId).then(function (res) {
                    if (res.success) {
                        userService.loadItems().then(function () {
                            vm.items = userService.getItems();
                        })
                        toastr.success('Questionnaire was deleted');
                    }
                    else {
                        console.log('error')
                    }
                });
            })
        }

        vm.createSurvey = createSurvey;
        function createSurvey(id, index, it) {

            $mdDialog.show({
                controller: 'CreateSurveyController',
                controllerAs: 'vm',
                templateUrl: 'components/survey-management/create-survey/create-survey.html',
                clickOutsideToClose: true,
                locals: {
                    data: {
                        id: id,
                        index: index,
                        it: it,
                    }
                }
            }).then(function (res) {
                if (res.type == 'update') {
                    vm.items = userService.getItems();
                    toastr.success('Questionnaire was updated');
                }
                else {
                    vm.items = userService.getItems();
                    toastr.success('Questionnaire was created');
                }

            })

        }

        // vm.ArchiveIsEmpti = ArchiveIsEmpti;
        // function ArchiveIsEmpti() {
        //     var status = false
        //     console.log(vm.items );
        //     for (var item in vm.items){
        //         if(vm.items[item].status === 0){
        //             status = true;
        //             break;
        //         }
        // }
        //     return status;
        //     // console.log('false');
        //
        // }

        // vm.ArchiveIsEmpti = function () {
        //     let archiveLength = false;
        //     for (var item in vm.items) {
        //         if (vm.items[item].status === 0) {
        //             archiveLength = true;
        //             break;
        //         }
        //     }
        //     console.log(archiveLength);
        //
        // };
    }
})();
