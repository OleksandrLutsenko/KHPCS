;(function () {
    'use strict';

    angular
        .module('service.surveyService', [])
        .service('surveyService', surveyService);

    surveyService.$inject = ['http', 'url'];

    function surveyService(http, url) {
        let model = {};

        // //Survey
        // model.createSurvey = createSurvey;
        // model.updateSurvey = updateSurvey;
        // model.deleteSurvey = deleteSurvey;
        // model.changeStatusSurvey = changeStatusSurvey;
        // model.archiveStatusSurvey = archiveStatusSurvey;
        //
        // //Survey block
        // model.createBlock = createBlock;
        // model.updateBlock = updateBlock;
        // model.deleteBlock = deleteBlock;

        //Survey question
        model.createQuestion = createQuestion;
        model.updateQuestion = updateQuestion;
        model.deleteQuestion = deleteQuestion;

        //Answer survey
        model.createAnswer = createAnswer;
        model.updateAnswer = updateAnswer;
        model.deleteAnswer = deleteAnswer;

        return model;

        //Survey question
        function createQuestion (id, credentials) {
            return http.post(url.survey_management_func(id).createQuestion, credentials);
        }
        function updateQuestion (id, credentials) {
            return http.put(url.survey_management_func(id).updateQuestion, credentials);
        }
        function deleteQuestion (id) {
            return http.delete(url.survey_management_func(id).updateQuestion, {});
        }

        //Survey answer
        function createAnswer (id, credentials) {
            return http.post(url.survey_management_func(id).createAnswer, credentials);
        }
        function updateAnswer (id, credentials) {
            return http.put(url.survey_management_func(id).updateAnswer, credentials);
        }
        function deleteAnswer (id) {
            return http.delete(url.survey_management_func(id).updateAnswer, {});
        }
    }
})();