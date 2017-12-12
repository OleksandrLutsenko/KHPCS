;(function () {
    'use strict';
    angular
        .module('app')
        .controller('DialogViewController', DialogViewController);

    DialogViewController.$inject = ['$mdDialog', 'dataFromDialog', 'userService'];

    function DialogViewController($mdDialog, dataFromDialog, userService) {
        let vm = this;

        let customer = dataFromDialog.customer;
        let reports = dataFromDialog.reports;
        let surveys = dataFromDialog.surveys;
        let templates = dataFromDialog.templates;
        let actualSurveyId;
        let actualSurveyName;
        let actualReportId;
        let actualTemplateId;
        let actualTemplateName;

        vm.surveys =[];
        vm.templates =[];
        vm.showTemplates = false;
        vm.showOK = false;
        vm.showLink = false;

        reports.forEach(function (item) {
            for (let i=0; i<surveys.length; i++) {
                if (item.survey_id === surveys[i].survey_id && surveys.survey_status !== 0) {
                    let tmpSurvey = {
                        report_id: item.id,
                        survey_id: item.survey_id,
                        name: surveys[i].survey_name
                    };
                    vm.surveys.push(tmpSurvey);
                    // console.log(vm.surveys);
                }
            }
        });

        vm.actualSurvey = function (survey) {
            actualSurveyId = survey.survey_id;
            actualSurveyName = survey.name;
            actualReportId = survey.report_id;
            // console.log('actualSurveyId = ' + actualSurveyId);
            // console.log('actualReportId = ' + actualReportId);

            for (let i=0; i<templates.length; i++) {
                if (actualSurveyId === templates[i].survey_id) {
                    let tmpTemplate = {
                        id: templates[i].id,
                        name: templates[i].title
                    };
                    vm.templates.push(tmpTemplate);
                }
            }
            vm.showTemplates = true;
        };

        vm.actualTemplate = function (template) {
            actualTemplateId = template.id;
            actualTemplateName = template.name;
            // console.log('actualTemplateId = ' + actualTemplateId);
            vm.showOK = true;
        };

        vm.cancel = function() {
            $mdDialog.cancel();
        };

        vm.finish = function() {
            // let filename = customer + ' ' + actualSurveyName + ' ' + actualTemplateName;
            let filename = customer + ' ' + actualSurveyName + ' ' + actualTemplateName + new Date().getTime();
            filename = filename.split(' ').join('_');
            userService.getContract(actualReportId, actualTemplateId, filename).then(function (link) {

                let downloadPDF = document.createElement('a');
                downloadPDF.setAttribute('href', link.filePathUrlPdf);
                downloadPDF.setAttribute('download', filename);
                downloadPDF.click();

                // userService.removePdf(link.filenamePdf).then(function (res) {
                //     console.log(res);
                // });
            });
            $mdDialog.cancel();
        };
    }
})();