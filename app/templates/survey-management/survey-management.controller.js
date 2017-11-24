;(function () {
    'use strict';

    angular.module('app')
        .controller('SurveyManagementController', SurveyManagementController);


    SurveyManagementController.$inject = ['userService', '$state', '$mdDialog', 'survey', '$mdSidenav'];

    function SurveyManagementController(userService, $state, $mdDialog, survey, $mdSidenav) {
        let vm = this;

        vm.setActineSurvey = setActineSurvey;

        vm.items = userService.getItems();
        console.log(vm.items);
        // console.log('vm.items при старте = ');
        // console.log(vm.items);

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

        vm.archiveSurvey = function (id, index) {
            userService.archiveStatusSurvey(id).then(function (res) {
                if (res.success) {
                    userService.loadItems().then(function () {
                        vm.items = userService.getItems();
                    });
                } else {
                    console.log('Archive Status Survey error');
                }

            });
        };
        //////////////////////////////////////////////////////////////////

        vm.toggleOpenArchive = buildToggler('right');
        function buildToggler(componentId) {
            return function() {
                $mdSidenav(componentId).toggle();
            };
        }
        vm.closeArchiveButton = function () {
            $mdSidenav('right').close();
            //     .then(function () {
            //         console.log("close RIGHT is done");
            // });
        };

        //////////////////////////////////////////////////////////////////


        vm.editSurvey = function (id, index) {
            console.log('Survey name: ' + vm.items[index].name);
            console.log('Survey id: ' + id);
            // console.log( vm.items[index]);

            $mdDialog.show({
                controller: EditSurveyController,
                controllerAs: 'vm',
                templateUrl: 'components/survey-management/edit-survey/edit-survey.html',
                clickOutsideToClose: true
            });

            function EditSurveyController($mdDialog) {
                let vs = this;

                if (typeof id != 'undefined') {
                    vs.data = {
                        name: vm.items[index].name,
                        description: vm.items[index].description
                    };
                }

                vs.save = function () {
                    if (typeof id != 'undefined') {
                        userService.updateSurvey(id, vs.data).then(function (res) {
                            if (res.success) {
                                userService.loadItems().then(function () {
                                    vm.items = userService.getItems();
                                });
                                // console.log('Заработало');
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

        vm.deleteSurvey = function (surveyId) {
            $mdDialog.show({
                controller: deleteSurveyController,
                controllerAs: 'vm',
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            });

            function deleteSurveyController($mdDialog) {
                let vs = this;

                vs.deleteSurveyYes = function () {
                    console.log('Удален опросник с ID: ' + surveyId);
                    userService.deleteSurvey(surveyId).then(function (res) {
                        if (res.success) {
                            console.log(res);
                            userService.loadItems().then(function () {
                                vm.items = userService.getItems();
                                $mdDialog.cancel();
                                // console.log(vm.items);

                            });
                        }
                        else {
                            console.log('errorDelete');
                        }
                    });
                    $mdDialog.cancel();
                };

                vs.deleteSurveyCancel = function () {
                    $mdDialog.cancel();
                };
            }
        };

        vm.createSurvey = function () {

            $mdDialog.show({
                controller: createSurveyController,
                controllerAs: 'vm',
                templateUrl: 'components/survey-management/create-survey/create-survey.html',
                clickOutsideToClose: true
            });

            function createSurveyController($mdDialog) {
                let vs = this;

                vs.createData = {
                    name: name,
                    description: "description",
                    status: "2"
                };

                vs.save = function () {
                    userService.createSurvey(vs.createData).then(function (res) {
                        if (res.success) {
                            userService.loadItems().then(function () {
                                vm.items = userService.getItems();
                                $mdDialog.cancel();
                            });
                        } else {
                            console.log('Save error');
                        }
                    });
                };

                vs.cancel = function () {
                    $mdDialog.cancel();
                };
            }

        };
    }
})();
