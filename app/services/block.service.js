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

        return model;

        function addBlockQuestion(id, credentials) {
            return http.post(url.survey_management_func(id).addBlockQuestion, credentials);
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
    }
})();