;(function () {
    'use strict';

    angular
        .module('service.questionService', [])
        .service('questionService', questionService);

    questionService.$inject = ['http', 'url'];

    function questionService(http, url) {
        let model = {};

        //Survey question
        model.createQuestion = createQuestion;
        model.updateQuestion = updateQuestion;
        model.deleteQuestion = deleteQuestion;

        //Survey answer
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