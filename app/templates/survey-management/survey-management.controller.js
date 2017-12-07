;(function () {
    'use strict';

    angular.module('app')
        .controller('SurveyManagementController', SurveyManagementController);


    SurveyManagementController.$inject = ['userService', '$mdDialog', 'survey', '$mdSidenav'];

    function SurveyManagementController(userService, $mdDialog, survey, $mdSidenav) {
        let vm = this;

        vm.setActineSurvey = setActineSurvey;

        vm.items = userService.getItems();

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
                if (res.type !== undefined) {
                    vm.items = userService.getItems();
                }

            })

        }
    }
})();
