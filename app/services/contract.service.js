;(function () {
    'use strict';

    angular
        .module('service.contractService', [])
        .service('contractService', contractService);

    contractService.$inject = ['http', 'url'];

    function contractService(http, url) {
        let model = {};

        model.loadingTemplatesForThePoll = loadingTemplatesForThePoll;
        model.getVariabilityWithDeleted = getVariabilityWithDeleted;

        return model;

        function loadingTemplatesForThePoll(id) {
            return http.get(url.contract_editor_func(id).getTemplatesForThePool);
        }
        function getVariabilityWithDeleted() {
            return http.get(url.contract_editor_func().getVariabilityWithDeleted);
        }
    }
})();