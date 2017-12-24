;(function () {
    'use strict';

    angular.module('app')
        .controller('SurveyManagementController', SurveyManagementController);


    SurveyManagementController.$inject = ['surveyService', '$mdDialog', 'survey', '$mdSidenav', 'toastr'];

    function SurveyManagementController(surveyService, $mdDialog, survey, $mdSidenav, toastr ) {
        let vm = this;

        vm.setActineSurvey = setActineSurvey;

        vm.survey = surveyService.getSurveyOnly();

        function setActineSurvey(survey_id, indexSurvey) {
            survey.setActineSurvey(survey_id, indexSurvey);
        }


        vm.activeSurvey = function (survey_id, index) {
            surveyService.changeStatusSurvey(survey_id).then(function (res) {
                if (res.success) {
                    surveyService.loadSurveyOnly().then(function (res) {
                        vm.survey = surveyService.getSurveyOnly();
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
                    surveyService.loadSurveyOnly().then(function (res) {
                        // console.log('only survey', res.data.result);
                        vm.survey = surveyService.getSurveyOnly();
                    });
                } else {
                    console.log('Archive Status Survey error');
                }

            });
        };

        function archiveEmpty() {
            vm.ArchiveIsEmpti = true;
            for (var item in vm.survey) {
                if (vm.survey[item].status === 0) {
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
                        surveyService.loadSurveyOnly().then(function (res) {
                            vm.survey = res;
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
        function createSurvey(survey_id, index, it) {
            $mdDialog.show({
                controller: 'CreateSurveyController',
                controllerAs: 'vm',
                templateUrl: 'components/survey-management/create-survey/create-survey.html',
                clickOutsideToClose: true,
                locals: {
                    data: {
                        id: survey_id,
                        index: index,
                        it: it,
                    }
                }
            }).then(function (res) {
                surveyService.loadSurveyOnly().then(function (res) {
                vm.survey = surveyService.getSurveyOnly();
            });
                if (res.type == 'update') {
                    toastr.success('Questionnaire was updated');
                }
                else {
                    toastr.success('Questionnaire was created');
                }
            })
        }
    }
})();
