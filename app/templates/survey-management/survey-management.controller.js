;(function () {
    'use strict';

    angular.module('app')
        .controller('SurveyManagementController', SurveyManagementController);


    SurveyManagementController.$inject = [ 'surveyService' , '$mdDialog', 'survey', '$mdSidenav' , 'toastr' ];

    function SurveyManagementController( surveyService, $mdDialog, survey, $mdSidenav , toastr) {
        let vm = this;

        vm.setActineSurvey = setActineSurvey;

        vm.items =  surveyService.getItems();
        console.log(vm.items);
        vm.survey = surveyService.loadSurveyOnly();
        console.log(vm.survey);
        surveyService.loadSurveyOnly().then(function (res) {
           console.log('only survey', res.data.result);
        });




        function setActineSurvey(id, indexSurvey) {
            survey.setActineSurvey(id, indexSurvey);
        }

        vm.activeSurvey = function (id, index) {
            surveyService.changeStatusSurvey(id).then(function (res) {
                if (res.success) {
                    surveyService.loadItems().then(function () {
                        vm.items =  surveyService.getItems();
                    });
                } else {
                    console.log('Change Status Survey error');
                }

            });
        };

        vm.archiveSurvey = function (id, eddOrExtract) {
            surveyService.archiveStatusSurvey(id).then(function (res) {
                if (res.success) {
                    toastr.success('Questionnaire was ' + eddOrExtract);
                    surveyService.loadItems().then(function () {
                        vm.items =  surveyService.getItems();
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
                surveyService.deleteSurvey(surveyId).then(function (res) {
                    if (res.success) {
                        surveyService.getItems().then(function () {
                            vm.items =  surveyService.getItems();
                        });
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
                    vm.items =  surveyService.getItems();
                    toastr.success('Questionnaire was updated');
                }
                else {
                    vm.items =  surveyService.getItems();
                    console.log('createQuest');
                    toastr.success('Questionnaire was created');
                }

            })

        }
    }
})();
