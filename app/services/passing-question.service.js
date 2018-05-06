;(function () {
    'use strict';

    angular
        .module('service.passingQuestionService', [])
        .service('passingQuestionService', passingQuestionService);

    passingQuestionService.$inject = ['http', 'url'];

    function passingQuestionService(http, url) {
        let model = {};

        model.sendCustomerAnswer = sendCustomerAnswer;
        model.getCustomerAnswer = getCustomerAnswer;
        model.getCustomerCommonAnswer = getCustomerCommonAnswer;
        model.createCustomerCommonAnswer = createCustomerCommonAnswer;
        model.createReport = createReport;

        return model;

        function sendCustomerAnswer(id, data) {
            return http.post(url.customers_func(id).sendCustomerAnswer, data);
        }

        function getCustomerAnswer(id) {
            return http.get(url.customers_func(id).getCustomerAnswer, {});
        }

        function getCustomerCommonAnswer(data) {
            return http.post(url.customers.getCustomerCommonAnswer, data);
        }

        function createCustomerCommonAnswer(data) {
            return http.post(url.customers.createCustomerCommonAnswer, data);
        }

        function createReport(data) {
            return http.post(url.report.createReport, data);
        }
    }
})();