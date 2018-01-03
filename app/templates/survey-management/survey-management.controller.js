;(function () {
    'use strict';

    angular.module('app')
        .controller('SurveyManagementController', SurveyManagementController);


    SurveyManagementController.$inject = ['surveyService', '$mdDialog', 'survey', '$mdSidenav', 'toastr', 'tabsService'];

    function SurveyManagementController(surveyService, $mdDialog, survey, $mdSidenav, toastr, tabsService) {
        let vm = this;
        tabsService.startTab('page2');

        vm.setActiveSurvey = setActiveSurvey;
        survey.setActiveBlock();

        vm.survey = surveyService.getSurveyOnly();

        function setActiveSurvey(survey_id, indexSurvey) {
            survey.setActiveSurvey(survey_id, indexSurvey);
        }

        vm.activeSurvey = function (survey_id) {
            surveyService.changeStatusSurvey(survey_id).then(function (res) {
                if (res.success) {
                    surveyService.loadSurveyOnly().then(function () {
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
                    surveyService.loadSurveyOnly().then(function () {
                        vm.survey = surveyService.getSurveyOnly();
                    });
                    toastr.success('Questionnaire was ' + eddOrExtract);
                } else {
                    console.log('Archive Status Survey error');
                }

            });
        };

        function archiveEmpty() {
            vm.ArchiveIsEmpty = true;
            for (let item in vm.survey) {
                if (vm.survey[item].survey_status === 'archived') {
                    vm.ArchiveIsEmpty = false;
                    console.log('vm.ArchiveIsEmpty = ' + vm.ArchiveIsEmpty);
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

        function deleteSurvey(surveyId, index) {
            $mdDialog.show({
                controller: 'DeleteViewController',
                controllerAs: 'vm',
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            }).then(function () {
                surveyService.deleteSurvey(surveyId).then(function (res) {
                    if (res.success) {
                        vm.survey.splice(index, 1);
                        toastr.success('Questionnaire was deleted');
                    }
                    else {
                        console.log('error')
                    }
                });
            })
        }

        vm.createSurvey = createSurvey;
        function createSurvey(survey_id, index, survey) {
            $mdDialog.show({
                controller: 'CreateSurveyController',
                controllerAs: 'vm',
                templateUrl: 'components/survey-management/create-survey/create-survey.html',
                clickOutsideToClose: true,
                locals: {
                    data: {
                        id: survey_id,
                        survey: survey
                    }
                }
            }).then(function (res) {

                res.data.survey.survey_id = res.data.survey.id;
                res.data.survey.survey_name = res.data.survey.name;

                if (res.type == 'update') {
                    vm.survey.splice(index, 1, res.data.survey);
                    toastr.success('Questionnaire was updated');
                }
                else {
                    vm.survey.push(res.data.survey);
                    toastr.success('Questionnaire was created');
                }
            })
        }
    }
})();
