;(function () {
    'use strict';

    angular
        .module('service.blockService', [])
        .service('blockService', blockService);

    blockService.$inject = ['http', 'url'];

    function blockService(http, url) {
        let model = {};

        model.addBlockQuestion = addBlockQuestion;

        model.createBlock = createBlock;
        model.updateBlock = updateBlock;
        model.deleteBlock = deleteBlock;
        model.orderUpdate = orderUpdate;
        model.updateQuestion = updateQuestion;
        model.updateAnswer = updateAnswer;

        //------Common question-----
        model.getCommon = getCommon;
        model.deleteCommon = deleteCommon;
        model.createCommon = createCommon;


        return model;

        function addBlockQuestion(id, data) {
            return http.post(url.survey_management_func(id).addBlockQuestion, data);
        }

        function updateQuestion(id , data) {
            return http.put(url.survey_management_func(id).updateQuestion , data)
        }

        function updateAnswer(id , data) {
            return http.put(url.survey_management_func(id).updateAnswer , data)
        }

        function createBlock(id, credentials) {
            return http.post(url.survey_management_func(id).createBlock, credentials);
        }

        function deleteBlock(id) {
            return http.delete(url.survey_management_func(id).updateBlock);
        }

        function updateBlock(id, data) {
            return http.put(url.survey_management_func(id).updateBlock, data);
        }

        function orderUpdate(id, data) {
            return http.put(url.survey_management_func(id).orderUpdate, data);
        }


        //------Common question-----
        function getCommon() {
            return http.get(url.common_func.getCommon);
        }

        function deleteCommon(data) {
            return http.post(url.common_func.deleteCommon, data);
        }

        function createCommon(data) {
            return http.post(url.common_func.createCommon, data);
        }
    }
})();