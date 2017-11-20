;(function () {
    'use strict';

    angular.module('app')
        .controller('SurveyManagementController', SurveyManagementController);


    SurveyManagementController.$inject = ['userService', '$state', '$mdDialog', 'survey'];

    function SurveyManagementController(userService, $state, $mdDialog, survey) {
        let vm = this;

        vm.setActineSurvey = setActineSurvey;

        vm.items = userService.getItems();
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

        vm.deleteSurvey = function (id) {
            userService.deleteSurvey(id).then(function (res) {
                if (res.success) {
                    userService.loadItems().then(function () {
                        vm.items = userService.getItems();
                    });
                } else {
                    console.log('Delete error');
                }

            });
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

        vm.superStatus = 'active';
        vm.showAllStatus = true;

        vm.showActive = function () {
            vm.superStatus = 'active';
            vm.showAllStatus = false;
        };

        vm.showInactive = function () {
            vm.superStatus = 'inactive';
            vm.showAllStatus = false;
        };

        vm.showArchive = function () {
            vm.superStatus = 'archived';
            vm.showAllStatus = false;

        }

        vm.showAll = function () {
            vm.showAllStatus = true;
        };
    }
})();
